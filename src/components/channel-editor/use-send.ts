import {api} from '~/trpc/react';
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
  const mutateThreadFirstComment =
    api.threads.createThreadFirstComment.useMutation();

  const {channelText, clearChannelText} = useChannelEditorStore(
    useShallow(state => ({
      channelText: state.channelText,
      clearChannelText: state.clearChannelText,
    }))
  );

  const sendFn = async () => {
    if (c.type === 'new-thread') {
      console.log('new thread: ', channelText);
      const {threadId} = await mutateThreadFirstComment.mutateAsync({
        text: channelText,
      });
      window.location.href = `/thread/${threadId}`;
    } else {
    }
    await queryClient.invalidateQueries({
      queryKey: ['threads', 'allThreads'],
    });
    clearChannelText();
  };

  return {sendFn};
};
