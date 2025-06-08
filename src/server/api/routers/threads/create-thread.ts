import {z} from 'zod';
import {TRPCError} from '@trpc/server';
import {publicProcedure} from '~/server/api/trpc';
import {Thread, Channel} from '~/server/db/schema/schema';

export const createThread = publicProcedure
  .output(
    z.object({
      threadId: z.string(),
      channelId: z.string(),
    })
  )
  .mutation(async ({ctx}) => {
    const [channel] = await ctx.db
      .insert(Channel)
      .values({
        name: 'New Channel',
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
