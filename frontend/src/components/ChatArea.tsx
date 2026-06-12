import React, { useEffect, useRef } from 'react';
import { Message } from '@/store/chat';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 message-enter`}
    >
      <div
        className={`max-w-xs lg:max-w-2xl px-4 py-3 rounded-lg group relative ${
          isUser
            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
            : 'hud-panel'
        }`}
      >
        <p className="text-sm md:text-base leading-relaxed">{message.content}</p>

        {/* Metadata */}
        <div className="mt-2 flex items-center justify-between gap-2 text-xs opacity-70">
          <span>
            {new Date(message.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          {!isUser && message.processing_time && (
            <span>{message.processing_time.toFixed(2)}s</span>
          )}
        </div>

        {/* Copy Button */}
        <button
          onClick={copyToClipboard}
          className="absolute -right-8 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-700 rounded"
          title="Copy message"
        >
          {copied ? (
            <Check size={14} className="text-green-400" />
          ) : (
            <Copy size={14} />
          )}
        </button>
      </div>
    </motion.div>
  );
};

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatArea: React.FC<ChatAreaProps> = ({ messages, isLoading }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-4 glow-text">
              JARVIS
            </div>
            <p className="text-gray-400 text-lg">Start a conversation</p>
          </div>
        </div>
      ) : (
        messages.map((message) => <ChatMessage key={message.id} message={message} />)
      )}

      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-2 items-center"
        >
          <div className="hud-panel px-4 py-3 w-full">
            <div className="flex gap-1 items-center">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-100" />
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-200" />
            </div>
          </div>
        </motion.div>
      )}

      <div ref={endRef} />
    </div>
  );
};

export default ChatArea;
