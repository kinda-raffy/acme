import {threadRouter} from '~/server/api/routers/thread';
import {createTRPCRouter, createCallerFactory} from '~/server/api/trpc';
import {channelRouter} from './routers/channel';

export const appRouter = createTRPCRouter({
  thread: threadRouter,
  channel: channelRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
