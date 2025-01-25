'use client'
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot } from "lucide-react";
import ChatMessage from "./ChatMessage";
import ChatControls from "./ChatControls";
import ChatInput from "./ChatInput";
import { useChat } from "@/hooks/use-chat";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const { messages, sendMessage, isLoading, error } = useChat();
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async (message) => {
    try {
      await sendMessage(message);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all z-50"
            onClick={() => setIsOpen(true)}
          >
            <Bot className="h-6 w-6 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              height: isMinimized
                ? "auto"
                : isMobile
                ? "calc(100vh - 32px)"
                : "600px",
            }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className={`fixed ${
              isMobile ? "inset-4" : "bottom-24 right-6 w-96"
            } bg-white rounded-2xl shadow-2xl flex flex-col z-50`}
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl flex justify-between items-center"
            >
              <div className="flex items-center space-x-2">
                <Bot className="h-6 w-6 text-white" />
                <h3 className="text-white font-semibold">
                  Financial Advisor 
                </h3>
              </div>
              <ChatControls
                isMinimized={isMinimized}
                onMinimize={() => setIsMinimized(!isMinimized)}
                onClose={() => {
                  setIsOpen(false);
                  setIsMinimized(false);
                }}
              />
            </motion.div>

            {/* Messages */}
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex-1 overflow-y-auto p-4 space-y-4"
                >
                  {messages.map((message, index) => (
                    <ChatMessage
                      key={index}
                      message={message}
                      delay={index * 0.1}
                    />
                  ))}
                  {error && (
                    <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-lg">
                      {error}
                    </div>
                  )}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex space-x-2 items-center justify-center"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200" />
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            {!isMinimized && (
              <ChatInput
                onSend={handleSend}
                isLoading={isLoading}
                placeholder="Ask about social media analytics..."
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
