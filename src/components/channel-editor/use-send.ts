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
  const mutateThread = api.threads.createThread.useMutation();
  const mutateComment = api.channel.createChannelComment.useMutation();
  const {channelText, clearChannelText} = useChannelEditorStore(
    useShallow(state => ({
      channelText: state.channelText,
      clearChannelText: state.clearChannelText,
    }))
  );

  const sendFn = async () => {
    if (c.type === 'new-thread') {
      const {threadId, channelId} = await mutateThread.mutateAsync();
      window.location.href = `/thread/${threadId}`;
      await mutateComment.mutateAsync({
        type: 'user',
        channelId,
        text: channelText,
      });
    } else {
    }
    await queryClient.invalidateQueries({
      queryKey: ['threads', 'allThreads'],
    });
    clearChannelText();
  };

  return {sendFn};
};
