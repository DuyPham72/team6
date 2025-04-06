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
        className={`max-w-[80%] p-3 rounded-lg ${
          isBot
            ? "bg-gradient-to-br from-violet-900/70 to-gray-800/80 border border-violet-500/30 shadow"
            : "bg-black/60 text-white border border-white/10"
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <span className="text-xs text-right block mt-1 opacity-50">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
};