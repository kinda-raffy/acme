import {z} from 'zod';
import {publicProcedure} from '~/server/api/trpc';
import {
  ChannelUserComment,
  ChannelAgentComment,
} from '~/server/db/schema/schema';

export const createChannelComment = publicProcedure
  .input(
    z.object({
      type: z.enum(['user', 'agent']),
      channelId: z.string(),
      text: z.string(),
      authorId: z.string(),
    })
  )
  .mutation(async ({ctx, input}) => {
    if (input.type === 'user') {
      await ctx.db.insert(ChannelUserComment).values({
        channelId: input.channelId,
        text: input.text,
        userId: input.authorId,
      });
    } else {
      await ctx.db.insert(ChannelAgentComment).values({
        channelId: input.channelId,
        text: input.text,
        agentId: input.authorId,
      });
    }
  });
