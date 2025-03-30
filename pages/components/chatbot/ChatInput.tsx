import { Send } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSend: () => void;
  disabled?: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export const ChatInput = ({
  value,
  onChange,
  onKeyDown,
  onSend,
  disabled,
  inputRef,
}: ChatInputProps) => {
  return (
    <div className="p-3 border-t bg-gradient-to-b from-black to-violet-900/70">
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          disabled={disabled}
          placeholder="Type a message..."
          className="flex-1 py-2 px-4 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-orange-400 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all"
        />
        <Button
          onClick={onSend}
          disabled={disabled || !value.trim()}
          variant="primary"
          className="ml-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Send message"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};