import {z} from 'zod';
import {eq} from 'drizzle-orm';
import {TRPCError} from '@trpc/server';
import {User} from '~/server/db/schema/schema';
import {publicProcedure, createTRPCRouter} from '~/server/api/trpc';

export const userRouter = createTRPCRouter({
  createUser: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .output(z.object({userId: z.string()}))
    .mutation(async ({ctx, input}) => {
      const [user] = await ctx.db
        .insert(User)
        .values({
          username: input.name,
        })
        .returning({
          userId: User.userId,
        });

      if (!user) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create user',
        });
      }

      return {
        userId: user.userId,
      };
    }),

  getUser: publicProcedure
    .input(z.object({userId: z.string()}))
    .output(z.object({userId: z.string(), username: z.string()}))
    .query(async ({ctx, input}) => {
      const user = await ctx.db.query.User.findFirst({
        where: eq(User.userId, input.userId),
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      return {
        userId: user.userId,
        username: user.username,
      };
    }),
});
