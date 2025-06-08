import {createTRPCRouter} from '~/server/api/trpc';
import {getThread} from './get-thread';
import {allThreads} from './all-threads';
import {createThread} from './create-thread';
import {invokeThreadAgent} from './invoke-agent';
import {createThreadTitle} from './thread-title';
import {createThreadComment} from './create-comment';

export const threadsRouter = createTRPCRouter({
  getThread: getThread,
  allThreads: allThreads,
  createThread: createThread,
  invokeThreadAgent: invokeThreadAgent,
  createThreadTitle: createThreadTitle,
  createThreadComment: createThreadComment,
});
