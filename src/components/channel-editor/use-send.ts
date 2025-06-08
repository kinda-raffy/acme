import {useShallow} from 'zustand/react/shallow';
import {useChannelEditorStore} from '~/state/channel-editor';

export const useSendChannelEditor = () => {
  const {channelText, clearChannelText} = useChannelEditorStore(
    useShallow(state => ({
      channelText: state.channelText,
      clearChannelText: state.clearChannelText,
    }))
  );

  const send = async () => {
    console.log(channelText);
    clearChannelText();
  };

  return {send};
};
