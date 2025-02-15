"use client";
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
  const {
    messages,
    sendMessage,
    isLoading,
    error,
    language,
    setLanguage,
    languages,
  } = useChat();
  const messagesEndRef = useRef(null);

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  const [voices, setVoices] = useState([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if ("speechSynthesis" in window) {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
    }

    // Listen for voice changes dynamically (useful for languages that load asynchronously)
    window.speechSynthesis.onvoiceschanged = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Text-to-Speech Functionality
  const speakMessage = (text, lang) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);

      // Find voice that matches the desired language
      const selectedVoice = voices.find((voice) => voice.lang.includes(lang));

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      } else {
        // If no specific voice is found for the language, fall back to the default voice
        utterance.voice = voices[0]; // Default to the first available voice
      }

      utterance.lang = lang;
      speechSynthesis.speak(utterance);
    }
  };

  // Function to handle when a message is sent
  const handleSendMessage = (msg) => {
    sendMessage(msg);

    // Speak only bot's responses (messages with sender === 'bot')
    if (
      messages.length > 0 &&
      messages[messages.length - 1]?.sender === "bot"
    ) {
      const botMessage = messages[messages.length - 1].text; // Get the latest bot message
      speakMessage(botMessage, language);
    }
  };

  return (
    <>
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

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className={`fixed ${isMobile ? "inset-4" : "bottom-24 right-6 w-96"} bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden`}
            style={{
              height: isMinimized
                ? "auto"
                : isMobile
                  ? "calc(100vh - 32px)"
                  : "600px",
            }}
          >
            <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Bot className="h-6 w-6 text-white" />
                <h3 className="text-white font-semibold">Chat Assistant</h3>
              </div>
              <select
                className="bg-white text-black rounded p-1"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {Object.entries(languages).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
              <ChatControls
                isMinimized={isMinimized}
                onMinimize={() => setIsMinimized(!isMinimized)}
                onClose={() => {
                  setIsOpen(false);
                  setIsMinimized(false);
                }}
              />
            </div>

            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex-1 overflow-y-auto p-4 space-y-4"
                >
                  {messages.map((message, index) => (
                    <ChatMessage key={index} message={message} />
                  ))}
                  {error && (
                    <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-lg">
                      {error}
                    </div>
                  )}
                  {isLoading && (
                    <div className="flex space-x-2 items-center justify-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200" />
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </motion.div>
              )}
            </AnimatePresence>

            {!isMinimized && (
              <ChatInput
                onSend={handleSendMessage}
                isLoading={isLoading}
                placeholder="Type your message..."
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
