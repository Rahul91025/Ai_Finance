import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const useChat = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm your Financial  analytics assistant. How can I help you today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async (content) => {
    try {
      setIsLoading(true);
      setError(null);

      // Add user message
      const userMessage = { role: "user", content };
      setMessages((prev) => [...prev, userMessage]);

      // Validate API key
      const apiKey = "AIzaSyDFYQBGPfgOjM6b8S6zBb_18SC43L11g40";
      if (!apiKey) {
        throw new Error("Missing Gemini API key");
      }

      // Initialize Gemini AI
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      // Get response from Gemini
      const result = await model.generateContent(content);
      const response = await result.response;
      const text = await response.text();

      if (!text) {
        throw new Error("Empty response from AI");
      }

      // Add assistant message
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
  };
};
