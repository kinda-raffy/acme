import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';

type ChannelEditorState = {
  channelText: string;
};

type ChannelEditorActions = {
  setChannelText: (text: string) => void;
  clearChannelText: () => void;
};

type ChannelEditorStore = ChannelEditorState & ChannelEditorActions;

export const useChannelEditorStore = create<ChannelEditorStore>()(
  immer(set => ({
    channelText: '',

    setChannelText: (text: string) =>
      set(state => {
        state.channelText = text;
      }),
    clearChannelText: () =>
      set(state => {
        state.channelText = '';
      }),
  }))
);

export const useIsSendButtonActive = () => {
  const channelText = useChannelEditorStore(state => state.channelText);

  return channelText.trim().length > 0;
};
