import {createTRPCRouter} from '~/server/api/trpc';
import {getThread} from './get-thread';
import {allThreads} from './all-threads';
import {createThread} from './create-thread';

export const threadsRouter = createTRPCRouter({
  getThread: getThread,
  allThreads: allThreads,
  createThread: createThread,
});
