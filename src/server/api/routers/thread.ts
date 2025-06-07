import {z} from 'zod';
import {eq} from 'drizzle-orm';
import {TRPCError} from '@trpc/server';
import {Thread, Channel} from '~/server/db/schema/schema';
import {publicProcedure, createTRPCRouter} from '~/server/api/trpc';

export const threadRouter = createTRPCRouter({
  getThread: publicProcedure
    .input(z.object({threadId: z.string()}))
    .output(
      z.object({
        threadId: z.string(),
        channelId: z.string(),
        isPublic: z.boolean(),
        channel: z.object({
          channelId: z.string(),
          name: z.string(),
          comments: z.array(
            z.discriminatedUnion('type', [
              z.object({
                type: z.literal('user'),
                commentId: z.string(),
                text: z.string(),
                authorId: z.string(),
              }),
              z.object({
                type: z.literal('agent'),
                commentId: z.string(),
                text: z.string(),
                authorId: z.string(),
              }),
            ])
          ),
        }),
      })
    )
    .query(async ({ctx, input}) => {
      const thread = await ctx.db.query.Thread.findFirst({
        where: eq(Thread.threadId, input.threadId),
        with: {
          channel: {
            with: {
              userComments: true,
              agentComments: true,
            },
          },
          participants: true,
        },
      });

      if (!thread) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Thread not found',
        });
      }

      return {
        threadId: thread.threadId,
        channelId: thread.channelId,
        isPublic: thread.isPublic,
        channel: {
          channelId: thread.channelId,
          name: thread.channel.name,
          comments: [
            ...thread.channel.userComments.map(c => ({
              type: 'user' as const,
              commentId: c.channelUserCommentId,
              text: c.text,
              authorId: c.userId,
            })),
            ...thread.channel.agentComments.map(c => ({
              type: 'agent' as const,
              commentId: c.channelAgentCommentId,
              text: c.text,
              authorId: c.agentId,
            })),
          ],
        },
      };
    }),

  createThread: publicProcedure
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
    }),
});
