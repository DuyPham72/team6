import { useEffect, useState } from "react";
import { BotAvatar } from "./BotAvatar";
import { Message } from "./Chatbot";
import { UserAvatar } from "./UserAvatar";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const isBot = message.role === "bot";
  
  return (
    <div
      className={`flex items-start gap-2.5 transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="flex-shrink-0">
        {isBot ? <BotAvatar /> : <UserAvatar />}
      </div>
      
      <div
        className={`max-w-[80%] p-3 rounded-lg backdrop-blur-sm ${
          isBot
            ? "bg-gradient-to-r from-violet-900/40 to-fuchsia-900/40 border border-violet-500/30 shadow-lg shadow-violet-500/10"
            : "bg-gradient-to-r from-gray-900/40 to-violet-900/40 border border-violet-500/20 shadow-lg shadow-violet-500/5"
        }`}
      >
        <p className="text-sm text-white/90">{message.content}</p>
        <span className="text-xs text-right block mt-1 text-violet-200/50">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
};