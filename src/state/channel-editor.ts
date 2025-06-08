import {create} from 'zustand';

type ChannelEditorState = {
  channelText: string;
};

type ChannelEditorActions = {
  setChannelText: (text: string) => void;
  clearChannelText: () => void;
};

type ChannelEditorStore = ChannelEditorState & ChannelEditorActions;

export const useChannelEditorStore = create<ChannelEditorStore>(set => ({
  channelText: '',

  setChannelText: (text: string) => set({channelText: text}),
  clearChannelText: () => set({channelText: ''}),
}));

export const useIsSendButtonActive = () => {
  const channelText = useChannelEditorStore(state => state.channelText);

  return channelText.trim().length > 0;
};
