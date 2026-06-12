import React from 'react';
import { Conversation } from '@/store/chat';
import { Trash2, Archive } from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  onDeleteConversation: (id: string) => void;
  isOpen?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  currentConversation,
  onSelectConversation,
  onDeleteConversation,
  isOpen = true,
}) => {
  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`w-64 border-r border-cyan-500/20 bg-gradient-to-b from-slate-900 to-slate-950 overflow-y-auto ${
        isOpen ? 'block' : 'hidden lg:block'
      }`}
    >
      <div className="p-4 space-y-2">
        <h2 className="text-lg font-semibold text-gray-300 mb-4">Conversations</h2>

        {conversations.length === 0 ? (
          <p className="text-gray-500 text-sm">No conversations yet</p>
        ) : (
          conversations.map((conv, index) => (
            <motion.button
              key={conv.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelectConversation(conv)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-all group ${
                currentConversation?.id === conv.id
                  ? 'bg-cyan-500/20 border border-cyan-500/50'
                  : 'hover:bg-slate-800 border border-transparent'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {conv.title || 'Untitled'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(conv.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(conv.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded"
                >
                  <Trash2 size={14} className="text-red-400" />
                </button>
              </div>
            </motion.button>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default Sidebar;
