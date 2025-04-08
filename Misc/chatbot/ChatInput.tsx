import { Send } from "lucide-react";
import React, { RefObject } from "react";
import { Button } from "../ui/button";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSend: () => void;
  disabled?: boolean;
  inputRef: RefObject<HTMLInputElement>;
}

export const ChatInput = ({
  value,
  onChange,
  onKeyDown,
  onSend,
  disabled = false,
  inputRef,
}: ChatInputProps) => {
  return (
    <div className="p-4 border-t border-gray-700 bg-gradient-to-b from-violet-900/50 to-gray-800/90 backdrop-blur-lg">
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          disabled={disabled}
          placeholder="Type a message..."
          className="flex-1 bg-white/10 border border-white/10 rounded-full py-3 px-4 pr-12 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
        />
        <Button
          onClick={onSend}
          disabled={disabled || !value.trim()}
          className={`rounded-full w-9 h-9 flex items-center justify-center ${
            !value.trim() || disabled
              ? "bg-gray-700 text-gray-400"
              : "bg-violet-600 text-white hover:bg-violet-500"
          }`}
          style={{marginLeft: '8px', marginRight: '8px'}}
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};