import { Minimize2, Maximize2, X } from "lucide-react";

const ChatControls = ({ isMinimized, onMinimize, onClose }) => {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={onMinimize}
        className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
        aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
      >
        {isMinimized ? (
          <Maximize2 className="h-4 w-4 text-white" />
        ) : (
          <Minimize2 className="h-4 w-4 text-white" />
        )}
      </button>
      <button
        onClick={onClose}
        className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
        aria-label="Close chat"
      >
        <X className="h-4 w-4 text-white" />
      </button>
    </div>
  );
};

export default ChatControls;
