import {createTRPCRouter} from '~/server/api/trpc';
import {createChannelComment} from './create-comment';

export const channelRouter = createTRPCRouter({
  createChannelComment: createChannelComment,
});
