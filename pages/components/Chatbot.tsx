import { cn } from "@/lib/utils";
import { MessageSquare, X } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useLocalStorage } from "../../lib/use-local-storage";
import { BotAvatar } from "../../Misc/chatbot/BotAvatar";
import { processUserMessage } from "../../Misc/chatbot/chatbotUtils";
import { ChatInput } from "../../Misc/chatbot/ChatInput";
import { ChatMessage } from "../../Misc/chatbot/ChatMessage";
import { Button } from "../../Misc/ui/button";
import { useToast } from "../../lib/use-toast";

export type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: number;
};

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useLocalStorage<Message[]>("chatbot-messages", []);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { toast } = useToast();
  
  // Initial greeting message if no messages exist
  const handleOpenChat = () => {
    if (
      messages.length === 0 ||
      messages[messages.length - 1].id?.startsWith("welcome") === false
    ) {
      const welcomeMessage: Message = {
        id: `welcome-${Date.now()}`,
        role: "bot",
        content: "Hi there! I'm your housing assistant. How can I help you today?",
        timestamp: Date.now(),
      };
  
      const updatedMessages = [...messages, welcomeMessage];
      setMessages(updatedMessages);
      localStorage.setItem("chatbot-messages", JSON.stringify(updatedMessages));
    }
  
    setIsOpen(true);
  };
  

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatbot-messages", JSON.stringify(messages));
    }
  }, [messages]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCloseChat = () => {
    setIsOpen(false);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputValue,
      timestamp: Date.now(),
    };
    
    // Add user message to state and localStorage
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    localStorage.setItem("chatbot-messages", JSON.stringify(updatedMessages));
    setInputValue("");
    setIsTyping(true);
    
    // Process the message and get a response
    try {
      const response = await processUserMessage(inputValue);
      
      // Add bot message
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        role: "bot",
        content: response.content,
        timestamp: Date.now(),
      };
      
      // Update messages with bot response
      const newMessages = [...updatedMessages, botMessage];
      setMessages(newMessages);
      localStorage.setItem("chatbot-messages", JSON.stringify(newMessages));
      
      // Handle redirection if needed
      if (response.type === 'redirect' && response.url) {
        setTimeout(() => {
          router.push(response.url!);
          setIsTyping(false);
        }, 1000);
      } else {
        setIsTyping(false);
      }
    } catch (error) {
      console.error("Error processing message:", error);
      setIsTyping(false);
      
      // Add error message
      const errorMessage: Message = {
        id: `bot-error-${Date.now()}`,
        role: "bot",
        content: "I'm having trouble processing your request. Please try again later.",
        timestamp: Date.now(),
      };
      const newMessages = [...updatedMessages, errorMessage];
      setMessages(newMessages);
      localStorage.setItem("chatbot-messages", JSON.stringify(newMessages));
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating chat button */}
      {!isOpen && (
        <button
          onClick={handleOpenChat}
          className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 shadow-lg flex items-center justify-center bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-500 hover:to-fuchsia-500 transition-all duration-300 animate-pulse hover:animate-none hover:scale-110 border border-violet-500/30 shadow-violet-500/20"
          aria-label="Open chat"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* Chat window */}
      <div
        className={cn(
          "fixed bottom-0 right-0 z-50 w-full sm:w-96 sm:right-6 sm:bottom-6 transition-all duration-300 ease-in-out transform backdrop-blur-md",
          isOpen
            ? "translate-y-0 opacity-100"
            : "translate-y-4 opacity-0 pointer-events-none"
        )}
      >
        <div className="overflow-hidden bg-gray-900/80 border border-violet-500/30 rounded-t-lg sm:rounded-lg shadow-2xl shadow-violet-500/20 flex flex-col h-[500px] max-h-[80vh]">
          {/* Chat header */}
          <div className="px-4 py-3 border-b border-violet-500/20 flex items-center justify-between bg-gradient-to-r from-violet-900/90 via-fuchsia-900/90 to-gray-900">
            <div className="flex items-center gap-2">
              <BotAvatar />
              <div>
                <h3 className="font-medium text-white">Housing Assistant</h3>
                <p className="text-xs text-violet-200/70">
                  {isTyping ? "Typing..." : "Online"}
                </p>
              </div>
            </div>
            <button
              onClick={handleCloseChat}
              aria-label="Close chat"
              className="inline-flex items-center justify-center text-violet-200 hover:text-white hover:bg-violet-500/20 rounded-full transition-all duration-300 p-2 border border-violet-500/30 shadow-lg shadow-violet-500/10 hover:scale-105 active:scale-95"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-900/90 via-violet-900/20 to-black">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isTyping && (
              <div className="flex items-center space-x-2">
                <BotAvatar size="sm" />
                <div className="flex space-x-1 p-2">
                  <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" 
                       style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-fuchsia-500 rounded-full animate-bounce" 
                       style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" 
                       style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <ChatInput
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleInputKeyDown}
            onSend={handleSendMessage}
            disabled={isTyping}
            inputRef={inputRef}
          />
        </div>
      </div>
    </>
  );
};

export default Chatbot;
