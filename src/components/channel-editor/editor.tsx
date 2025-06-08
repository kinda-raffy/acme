'use client';

import {useRef, useEffect, useCallback} from 'react';
import {ArrowUp} from 'lucide-react';
import {usePathname} from 'next/navigation';
import {useShallow} from 'zustand/react/shallow';
import {
  useChannelEditorStore,
  useIsSendButtonActive,
} from '~/state/channel-editor';
import {Button} from '../ui/button';
import {useSendChannelEditor} from './use-send';

export const ChannelEditor = () => {
  return (
    <div className="bg-muted p-2 pb-0 rounded-t-xl">
      <div className="bg-background border border-b-0 border-border rounded-t-lg p-2">
        <ChannelEditorInput />
        <div className="flex justify-end">
          <ChannelEditorSubmit />
        </div>
      </div>
    </div>
  );
};

export const ChannelEditorInput = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const {channelText, setChannelText} = useChannelEditorStore(
    useShallow(state => ({
      channelText: state.channelText,
      setChannelText: state.setChannelText,
    }))
  );

  const autoResizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setChannelText(e.target.value);
    autoResizeTextarea();
  };

  return (
    <textarea
      ref={textareaRef}
      onInput={handleInput}
      value={channelText}
      placeholder="Type your message here..."
      className="w-full resize-none min-h-[48px] pt-3 max-h-[200px] p-3 focus:outline-none text-foreground placeholder-muted-foreground transition-all duration-150 overflow-auto bg-background"
    />
  );
};

export const ChannelEditorSubmit = () => {
  const isSendButtonActive = useIsSendButtonActive();
  const pathname = usePathname();
  const isNewThread = pathname === '/';

  const type = isNewThread ? 'new-thread' : 'existing-thread';
  const threadId = isNewThread ? '' : (pathname.split('/')[2] ?? '');

  const {sendFn} = useSendChannelEditor({type, threadId});

  const handleKeyDown = useCallback(
    (event: KeyboardEvent): void => {
      if (event.key === 'Enter' && !event.shiftKey && isSendButtonActive) {
        event.preventDefault();
        void sendFn();
      }
    },
    [isSendButtonActive, sendFn]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, sendFn, isSendButtonActive]);

  return (
    <Button
      variant={isSendButtonActive ? 'default' : 'outline'}
      size="icon"
      className="size-9"
      disabled={!isSendButtonActive}
      onClick={sendFn}
    >
      <ArrowUp size={20} />
    </Button>
  );
};
