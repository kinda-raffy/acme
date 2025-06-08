import {z} from 'zod';
import {eq} from 'drizzle-orm';
import {TRPCError} from '@trpc/server';
import {publicProcedure} from '~/server/api/trpc';
import {
  Thread,
  ChannelUserComment,
  ChannelAgentComment,
} from '~/server/db/schema/schema';

export const createThreadComment = publicProcedure
  .input(
    z.object({
      type: z.enum(['user', 'agent']),
      threadId: z.string(),
      text: z.string(),
    })
  )
  .mutation(async ({ctx, input}) => {
    const [thread] = await ctx.db
      .selectDistinct({
        channelId: Thread.channelId,
      })
      .from(Thread)
      .where(eq(Thread.threadId, input.threadId))
      .limit(1);

    if (!thread?.channelId) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Thread not found',
      });
    }

    if (input.type === 'user') {
      await ctx.db.insert(ChannelUserComment).values({
        channelId: thread.channelId,
        text: input.text,
      });
    } else {
      await ctx.db.insert(ChannelAgentComment).values({
        channelId: thread.channelId,
        text: input.text,
      });
    }
  });
