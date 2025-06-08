import {z} from 'zod';
import {env} from '~/env';
import {TRPCError} from '@trpc/server';
import {publicProcedure} from '~/server/api/trpc';
import {Thread, Channel} from '~/server/db/schema/schema';
import {
  ConverseCommand,
  BedrockRuntimeClient,
  type ConversationRole,
  type BedrockRuntimeClientConfig,
} from '@aws-sdk/client-bedrock-runtime';
import {getAwsCognitoCredentials} from '../../aws/cred';

const generateThreadTitle = async (text: string): Promise<string> => {
  const config: BedrockRuntimeClientConfig = {
    region: env.AWS_REGION,
    credentials: await getAwsCognitoCredentials(),
  };
  const client = new BedrockRuntimeClient(config);

  const input = {
    modelId: env.AWS_BEDROCK_MODEL_ID,
    system: [
      {text: 'You are a helpful assistant that generates concise titles.'},
    ],
    messages: [
      {
        role: 'user' as ConversationRole,
        content: [
          {
            text: `Generate a short, concise title (max 5 words) for a thread based on the text: ${text}`,
          },
        ],
      },
    ],
    inferenceConfig: {
      maxTokens: 50,
      temperature: 0.7,
      topP: 0.9,
    },
  };

  try {
    const response = await client.send(new ConverseCommand(input));
    if (!response?.output?.message?.content?.[0]?.text) {
      throw new Error('No response text from Bedrock');
    }
    return response.output.message.content[0].text.trim().replace('"', '');
  } catch (error) {
    console.error('Error generating title:', error);
    return text.slice(0, 50); // Fallback to first 50 chars of input text.
  }
};

export const createThreadFirstComment = publicProcedure
  .output(
    z.object({
      threadId: z.string(),
      channelId: z.string(),
    })
  )
  .input(z.object({text: z.string()}))
  .mutation(async ({ctx, input}) => {
    const title = await generateThreadTitle(input.text);

    const [channel] = await ctx.db
      .insert(Channel)
      .values({
        name: title,
      })
      .returning({
        channelId: Channel.channelId,
      });

    if (!channel) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create channel',
      });
    }

    const [thread] = await ctx.db
      .insert(Thread)
      .values({
        channelId: channel.channelId,
        isPublic: false,
      })
      .returning({
        threadId: Thread.threadId,
      });

    if (!thread) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create thread',
      });
    }

    return {
      threadId: thread.threadId,
      channelId: channel.channelId,
    };
  });
