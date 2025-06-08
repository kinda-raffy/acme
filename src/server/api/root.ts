import {createTRPCRouter, createCallerFactory} from '~/server/api/trpc';
import {userRouter} from './routers/user';
import {channelRouter} from './routers/channel/_route';
import {threadsRouter} from './routers/threads/_route';

export const appRouter = createTRPCRouter({
  threads: threadsRouter,
  channel: channelRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
