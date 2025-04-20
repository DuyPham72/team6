import { useEffect, useState } from "react";
import { Message } from "../../pages/components/Chatbot";
import { BotAvatar } from "./BotAvatar";
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
  
  const renderContent = (content: any) => {
    if (typeof content === 'string') {
      return content;
    }
    if (typeof content === 'object' && content !== null) {
      if (content.type === 'redirect' && content.url) {
        return `Redirecting to: ${content.url}`;
      }
      try {
        return JSON.stringify(content);
      } catch {
        return 'Unable to display message content';
      }
    }
    return String(content);
  };

  return (
    <div
      className={`flex items-start gap-3 transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${isBot ? "justify-start" : "justify-end flex-row-reverse"}`}
    >
      <div className="flex-shrink-0">
        {isBot ? <BotAvatar /> : <UserAvatar />}
      </div>
      
      <div
        className={`max-w-[80%] p-3 rounded-lg backdrop-blur-sm ${
          isBot
            ? "bg-gradient-to-r from-violet-900/40 to-fuchsia-900/40 border border-violet-500/30 shadow-lg shadow-violet-500/10"
            : "bg-gradient-to-r from-fuchsia-600/40 to-violet-600/40 border border-fuchsia-500/30 shadow-lg shadow-fuchsia-500/10"
        }`}
      >
        <p className="text-sm text-white/90">{renderContent(message.content)}</p>
        <span className={`text-xs block mt-1 ${isBot ? "text-violet-200/50" : "text-fuchsia-200/50"}`}>
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
};
