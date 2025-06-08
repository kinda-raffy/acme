import {z} from 'zod';
import {env} from '~/env';
import {eq} from 'drizzle-orm';
import {TRPCError} from '@trpc/server';
import {uuidSortBy} from '~/lib/uuidv7';
import {Thread} from '~/server/db/schema/schema';
import {publicProcedure} from '~/server/api/trpc';
import {
  BedrockRuntimeClient,
  ConverseStreamCommand,
  type ConversationRole,
  type ConverseStreamCommandInput,
  type BedrockRuntimeClientConfig,
} from '@aws-sdk/client-bedrock-runtime';
import {getAwsCognitoCredentials} from '../../aws/cred';

type ChannelCommentFeed = Array<{
  role: 'user' | 'agent';
  commentId: string;
  content: string;
}>;

export const invokeAgent = publicProcedure
  .input(z.object({threadId: z.string()}))
  .subscription(async function* ({ctx, input: {threadId}}) {
    const thread = await ctx.db.query.Thread.findFirst({
      where: eq(Thread.threadId, threadId),
      with: {
        channel: {
          with: {
            userComments: true,
            agentComments: true,
          },
        },
      },
    });

    if (!thread) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Thread not found',
      });
    }

    const channelCommentFeed: ChannelCommentFeed = uuidSortBy({
      items: [
        ...thread.channel.userComments.map(comment => ({
          role: 'user' as const,
          commentId: comment.channelUserCommentId,
          content: comment.text,
        })),
        ...thread.channel.agentComments.map(comment => ({
          role: 'agent' as const,
          commentId: comment.channelAgentCommentId,
          content: comment.text,
        })),
      ],
      id: comment => comment.commentId,
      order: 'oldest-first',
    });

    const config: BedrockRuntimeClientConfig = {
      region: env.AWS_REGION,
      credentials: await getAwsCognitoCredentials(),
    };
    const client = new BedrockRuntimeClient(config);

    const messages = channelCommentFeed.map(comment => ({
      role: (comment.role === 'user'
        ? 'user'
        : 'assistant') as ConversationRole,
      content: [{text: comment.content}],
    }));

    const bedrockInput: ConverseStreamCommandInput = {
      modelId: env.AWS_BEDROCK_MODEL_ID,
      system: [
        {
          text: 'You are a helpful AI assistant that provides clear and concise responses.',
        },
      ],
      messages,
      inferenceConfig: {
        maxTokens: 1000,
        temperature: 0.7,
        topP: 0.9,
      },
    };

    try {
      const command = new ConverseStreamCommand(bedrockInput);
      const response = await client.send(command);

      if (!response.stream) {
        throw new Error('No stream response from Bedrock');
      }

      // Process the stream using async iterator.
      for await (const chunk of response.stream) {
        if (
          'contentBlockDelta' in chunk &&
          chunk.contentBlockDelta?.delta?.text
        ) {
          yield chunk.contentBlockDelta.delta.text;
        }
      }
    } catch (error) {
      console.error('Error in Bedrock streaming:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to generate response',
      });
    }
  });
