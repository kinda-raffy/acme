'use client';

import {AnimatedMarkdown} from 'flowtoken';
import 'flowtoken/dist/styles.css';
import {useShallow} from 'zustand/react/shallow';
import {useChannelEditorStore} from '~/state/channel-editor';

export const ThreadList = () => {
  const {channelText} = useChannelEditorStore(
    useShallow(state => ({
      channelText: state.channelText,
    }))
  );

  return (
    <AnimatedMarkdown
      content={channelText}
      animation="fadeIn"
      animationDuration="0.5s"
      animationTimingFunction="ease-in-out"
    />
  );
};
