import {z} from 'zod';
import {env} from '~/env';
import {eq} from 'drizzle-orm';
import {publicProcedure} from '~/server/api/trpc';
import {Channel} from '~/server/db/schema/schema';
import {
  ConverseCommand,
  BedrockRuntimeClient,
  type ConverseCommandInput,
  type BedrockRuntimeClientConfig,
} from '@aws-sdk/client-bedrock-runtime';
import {getAwsCognitoCredentials} from '../../aws/cred';

export const createThreadTitle = publicProcedure
  .input(z.object({channelId: z.string(), text: z.string()}))
  .mutation(async ({ctx, input}) => {
    const title = await generateTitle(input.text);

    await ctx.db
      .update(Channel)
      .set({
        name: title,
      })
      .where(eq(Channel.channelId, input.channelId));
  });

const generateTitle = async (text: string): Promise<string> => {
  const config: BedrockRuntimeClientConfig = {
    region: env.AWS_REGION,
    credentials: await getAwsCognitoCredentials(),
  };
  const client = new BedrockRuntimeClient(config);

  const input: ConverseCommandInput = {
    modelId: env.AWS_BEDROCK_MODEL_ID,
    system: [{text: 'You generate concise titles in natural language.'}],
    messages: [
      {
        role: 'user',
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
