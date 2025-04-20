import { cn } from "@/lib/utils";
import { MessageSquare, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocalStorage } from "../../lib/use-local-storage";
import { Button } from "../../components/ui/button";
import { BotAvatar } from "./BotAvatar";
import { processUserMessage } from "./chatbotUtils";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";

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
  
  // Initial greeting message if no messages exist
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "bot",
          content: "Hi there! I'm your housing assistant. How can I help you today?",
          timestamp: Date.now(),
        },
      ]);
    }
  }, [messages.length, setMessages]);

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

  const handleOpenChat = () => {
    setIsOpen(true);
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
    
    setMessages([...messages, userMessage]);
    setInputValue("");
    setIsTyping(true);
    
    // Process the message and get a response
    try {
      // Store the original response
      const response = await processUserMessage(inputValue);
      
      // Debug log to see what the response looks like
      console.log("Response from processUserMessage:", response);
      
      // Convert response to string, regardless of what it is
      let botResponseText: string;
      
      if (typeof response === 'string') {
        botResponseText = response;
      } else if (response === null || response === undefined) {
        botResponseText = "I'm not sure how to respond to that.";
      } else if (typeof response === 'object') {
        // Check if it has type and url properties
        if ('type' in response && 'url' in response) {
          botResponseText = `I found a ${response.type} resource for you at: ${response.url}`;
          window.location.href = response.url;
        } else {
          try {
            botResponseText = JSON.stringify(response);
          } catch (e) {
            botResponseText = "I received a response I can't display properly.";
          }
        }
      } else {
        // For any other type (number, boolean, etc.)
        botResponseText = String(response);
      }
      
      // Add bot response after a small delay to simulate typing
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            role: "bot",
            content: botResponseText,
            timestamp: Date.now(),
          },
        ]);
        setIsTyping(false);
      }, 500 + Math.random() * 1000);
    } catch (error) {
      console.error("Error processing message:", error);
      setIsTyping(false);
      
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-error-${Date.now()}`,
          role: "bot",
          content: "I'm having trouble processing your request. Please try again later.",
          timestamp: Date.now(),
        },
      ]);
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
        <Button
          onClick={handleOpenChat}
          className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 shadow-lg flex items-center justify-center bg-white text-white hover:bg-gray-800 transition-all duration-300 animate-fade-in"
          aria-label="Open chat"
        >
          <MessageSquare className="w-6 h-6" />
        </Button>
      )}

      {/* Chat window */}
      <div
        className={cn(
          "fixed bottom-0 right-0 z-50 w-full sm:w-96 sm:right-6 sm:bottom-6 transition-all duration-300 ease-in-out transform",
          isOpen
            ? "translate-y-0 opacity-100"
            : "translate-y-4 opacity-0 pointer-events-none"
        )}
      >
        <div className="overflow-hidden bg-white border border-gray-200 rounded-t-lg sm:rounded-lg shadow-2xl flex flex-col h-[500px] max-h-[80vh]">
          {/* Chat header */}
          <div className="px-4 py-3 border-b flex items-center justify-between bg-gradient-to-b from-black to-violet-900/70">
            <div className="flex items-center gap-2 ">
              <BotAvatar />
              <div>
                <h3 className="font-medium text-white">Housing Assistant</h3>
                <p className="text-xs text-white">
                  {isTyping ? "Typing..." : "Online"}
                </p>
              </div>
            </div>
            <Button
              variant="secondary"
              onClick={handleCloseChat}
              aria-label="Close chat"
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-black to-violet-900/70">
            {messages.map((message) => {
              // Ensure message content is always a string before rendering
              const safeMessage = {
                ...message,
                content: typeof message.content === 'string' 
                  ? message.content
                  : typeof message.content === 'object'
                    ? JSON.stringify(message.content)
                    : String(message.content)
              };
              return <ChatMessage key={message.id} message={safeMessage} />;
            })}
            {isTyping && (
              <div className="flex items-center space-x-2 animate-pulse">
                <BotAvatar size="sm" />
                <div className="bg-gray-200 h-8 w-16 rounded-full"></div>
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

