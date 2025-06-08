import {api} from '~/trpc/react';
import {useSession} from '~/state/session';
import {useShallow} from 'zustand/react/shallow';
import {useQueryClient} from '@tanstack/react-query';
import {useChannelEditorStore} from '~/state/channel-editor';

type SendChannelEditorProps =
  | {
      type: 'new-thread';
    }
  | {
      type: 'existing-thread';
      threadId: string;
    };

export const useSendChannelEditor = (c: SendChannelEditorProps) => {
  const queryClient = useQueryClient();
  const createThread = api.threads.createThread.useMutation();
  const createThreadTitle = api.threads.createThreadTitle.useMutation();
  const createThreadComment =
    api.threads.createThreadComment.useMutation();
  const {setActiveThreadShouldAgentRespond} = useSession(
    useShallow(state => ({
      setActiveThreadShouldAgentRespond:
        state.setActiveThreadShouldAgentRespond,
    }))
  );

  const {channelText, clearChannelText} = useChannelEditorStore(
    useShallow(state => ({
      channelText: state.channelText,
      clearChannelText: state.clearChannelText,
    }))
  );

  const sendFn = async () => {
    if (c.type === 'new-thread') {
      console.log('new thread: ', channelText);
      const {threadId, channelId} = await createThread.mutateAsync();
      window.location.href = `/thread/${threadId}`;
      await Promise.all([
        createThreadTitle.mutateAsync({
          channelId,
          text: channelText,
        }),
        createThreadComment.mutateAsync({
          threadId,
          type: 'user',
          text: channelText,
        }),
      ]);
    } else {
      await createThreadComment.mutateAsync({
        threadId: c.threadId,
        type: 'user',
        text: channelText,
      });
    }

    await queryClient.invalidateQueries({
      queryKey: ['threads'],
    });
    setActiveThreadShouldAgentRespond(true);
    clearChannelText();
  };

  return {sendFn};
};
