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
    <div className="p-3 border-t border-violet-500/20 bg-gradient-to-b from-gray-900/90 to-black">
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          disabled={disabled}
          placeholder="Type a message..."
          className="flex-1 py-2 px-4 bg-gray-900/50 border border-violet-500/30 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent transition-all placeholder:text-violet-200/30 text-white/90"
        />
        <button
          onClick={onSend}
          disabled={disabled || !value.trim()}
          className="inline-flex items-center justify-center ml-2 w-16 h-16 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-500 hover:to-fuchsia-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20 border border-violet-500/30 hover:shadow-violet-500/40 hover:scale-105 active:scale-95"
          aria-label="Send message"
        >
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="w-10 h-10"
          >
            <path d="M22 2L11 13" />
            <path d="M22 2L15 22L11 13L2 9L22 2Z" />
          </svg>
        </button>
      </div>
    </div>
  );
};