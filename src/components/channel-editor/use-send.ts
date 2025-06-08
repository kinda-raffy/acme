import {api} from '~/trpc/react';
import {useShallow} from 'zustand/react/shallow';
import {useChannelEditorStore} from '~/state/channel-editor';

export const useSendChannelEditor = (c: {isNewThread?: boolean}) => {
  const mutateThread = api.threads.createThread.useMutation();
  const mutateComment = api.channel.createChannelComment.useMutation();
  const {channelText, clearChannelText} = useChannelEditorStore(
    useShallow(state => ({
      channelText: state.channelText,
      clearChannelText: state.clearChannelText,
    }))
  );

  const send = async () => {
    if (c.isNewThread) {
      const {threadId, channelId} = await mutateThread.mutateAsync();
      window.location.href = `/thread/${threadId}`;
      await mutateComment.mutateAsync({
        type: 'user',
        channelId,
        text: channelText,
      });
    } else {
    }
    clearChannelText();
  };

  return {send};
};
