'use client';

import {useRef} from 'react';
import {ArrowUp} from 'lucide-react';
import {Button} from '../ui/button';

export const TextEditor = () => {
  return (
    <div className="bg-neutral-100 p-2 pb-0 rounded-t-xl">
      <div className="bg-neutral-50 border border-b-0 border-neutral-200 rounded-t-lg p-2">
        <TextEditorInput />
        <div className="flex justify-end">
          <TextEditorSubmit />
        </div>
      </div>
    </div>
  );
};

export const TextEditorInput = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };

  const handleInput = (_: React.ChangeEvent<HTMLTextAreaElement>) => {
    autoResizeTextarea();
  };

  return (
    <textarea
      ref={textareaRef}
      onInput={handleInput}
      placeholder="Type your message here..."
      className="w-full resize-none min-h-[48px] pt-3 max-h-[200px] p-3 focus:outline-none text-shadow-neutral-800 placeholder-neutral-400 transition-all duration-150 overflow-auto"
    />
  );
};

export const TextEditorSubmit = () => {
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <Button
      ref={submitButtonRef}
      variant="default"
      size="icon"
      className="size-9"
    >
      <ArrowUp size={20} />
    </Button>
  );
};
