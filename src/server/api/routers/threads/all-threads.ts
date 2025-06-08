import {z} from 'zod';
import {publicProcedure} from '~/server/api/trpc';

export const allThreads = publicProcedure
  .output(
    z.object({
      threads: z.array(
        z.object({
          threadId: z.string(),
          channelId: z.string(),
        })
      ),
    })
  )
  .query(async ({ctx}) => {
    const threads = await ctx.db.query.Thread.findMany({
      with: {
        channel: true,
      },
    });

    return {
      threads,
    };
  });
