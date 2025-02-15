import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const useChat = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm your Financial analytics assistant. How can I help you today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState("en");

  const languages = {
    en: "English",
    hi: "Hindi",
    bn: "Bengali",
    ta: "Tamil",
    te: "Telugu",
    mr: "Marathi",
    gu: "Gujarati",
    kn: "Kannada",
    ml: "Malayalam",
    pa: "Punjabi",
  };

  const sendMessage = async (content) => {
    try {
      setIsLoading(true);
      setError(null);

      const userMessage = { role: "user", content };
      setMessages((prev) => [...prev, userMessage]);

      const apiKey = "AIzaSyDFYQBGPfgOjM6b8S6zBb_18SC43L11g40";
      if (!apiKey) {
        throw new Error("Missing Gemini API key");
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      // Translate prompt to the selected language
      const translatedPrompt = `Respond in ${languages[language]}: ${content}`;

      const result = await model.generateContent(translatedPrompt);
      const response = await result.response;
      const text = await response.text();

      if (!text) {
        throw new Error("Empty response from AI");
      }

      const assistantMessage = { role: "assistant", content: text };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Error sending message:", err);
      setError(err.message || "An unexpected error occurred");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    sendMessage,
    isLoading,
    error,
    language,
    setLanguage,
    languages,
  };
};
