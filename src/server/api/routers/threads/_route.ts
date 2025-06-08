import {createTRPCRouter} from '~/server/api/trpc';
import {getThread} from './get-thread';
import {allThreads} from './all-threads';
import {invokeAgent} from './invoke-agent';
import {createThread} from './create-thread';
import {createThreadTitle} from './thread-title';
import {createThreadFirstComment} from './first-comment';

export const threadsRouter = createTRPCRouter({
  getThread: getThread,
  allThreads: allThreads,
  createThread: createThread,
  invokeAgent: invokeAgent,
  createThreadTitle: createThreadTitle,
  createThreadFirstComment: createThreadFirstComment,
});
