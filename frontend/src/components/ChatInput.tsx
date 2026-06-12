import React, { useState } from 'react';
import { Send, Mic, StopCircle } from 'lucide-react';
import { GlassInput, GlassButton } from './HUD';
import { motion } from 'framer-motion';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onVoiceStart?: () => void;
  onVoiceStop?: () => void;
  isLoading: boolean;
  voiceEnabled?: boolean;
  isRecording?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onVoiceStart,
  onVoiceStop,
  isLoading,
  voiceEnabled = true,
  isRecording = false,
}) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="border-t border-cyan-500/20 bg-gradient-to-t from-slate-950 to-slate-900 p-4"
    >
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-3">
        {/* Voice Button */}
        {voiceEnabled && (
          <button
            type="button"
            onClick={isRecording ? onVoiceStop : onVoiceStart}
            className={`p-3 rounded-lg border transition-all ${
              isRecording
                ? 'bg-red-500/20 border-red-500/50 hover:bg-red-500/30'
                : 'bg-cyan-500/20 border-cyan-500/50 hover:bg-cyan-500/30'
            }`}
            title={isRecording ? 'Stop recording' : 'Start voice input'}
          >
            {isRecording ? (
              <StopCircle size={20} className="text-red-400" />
            ) : (
              <Mic size={20} className="text-cyan-400" />
            )}
          </button>
        )}

        {/* Input */}
        <div className="flex-1 relative">
          <GlassInput
            type="text"
            placeholder="Ask me anything..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isLoading}
            className="w-full"
          />
        </div>

        {/* Send Button */}
        <GlassButton
          type="submit"
          disabled={isLoading || !message.trim()}
          className="flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={18} />
          <span className="hidden sm:inline">Send</span>
        </GlassButton>
      </form>
    </motion.div>
  );
};

export default ChatInput;
