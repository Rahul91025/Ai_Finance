import "regenerator-runtime/runtime";
import { Send, Mic } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const ChatInput = ({
  onSend,
  isLoading,
  placeholder = "Type your message...",
}) => {
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    finalTranscript,
  } = useSpeechRecognition();

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
    }
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [input]);

  useEffect(() => {
    if (finalTranscript && isListening) {
      setInput(finalTranscript);
      resetTranscript();
    }
  }, [finalTranscript, isListening, resetTranscript]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    onSend(input.trim());
    setInput("");
    resetTranscript();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleListening = async () => {
    if (!browserSupportsSpeechRecognition) return;

    if (isListening) {
      SpeechRecognition.stopListening();
      setIsListening(false);
    } else {
      try {
        setInput(""); // Clear input before listening
        resetTranscript(); // Clear transcript before listening

        await SpeechRecognition.startListening({
          continuous: false, // Listen for a single phrase
          language: "en-IN", // Or your preferred language
          interimResults: false, // Only get the final transcript
        });
        setIsListening(true);
      } catch (error) {
        console.error("Speech Recognition Error:", error);
        if (error.message.includes("not-allowed")) {
          alert("Microphone access denied. Please allow microphone access in your browser settings.");
        } else {
          alert("An error occurred during speech recognition. Please try again.");
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100">
      <div className="flex space-x-2 items-center">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className="flex-1 px-4 py-2 border rounded-lg resize-none max-h-32 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm md:text-base"
          disabled={isLoading}
        />

        <button
          type="button"
          onClick={toggleListening}
          className={`p-2 rounded-lg transition-all ${
            isListening
              ? "bg-red-500 text-white animate-pulse"
              : "bg-gray-200 hover:bg-gray-300 text-gray-600"
          }`}
        >
          <Mic className="h-5 w-5" />
        </button>

        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
