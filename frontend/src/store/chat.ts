import { create } from 'zustand';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  tokens_used?: number;
  processing_time?: number;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title?: string;
  description?: string;
  is_archived: number;
  created_at: string;
  updated_at: string;
  messages?: Message[];
}

interface ChatStore {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  isSending: boolean;
  setConversations: (conversations: Conversation[]) => void;
  setCurrentConversation: (conversation: Conversation | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsSending: (isSending: boolean) => void;
  clear: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoading: false,
  isSending: false,
  setConversations: (conversations) => set({ conversations }),
  setCurrentConversation: (currentConversation) => set({ currentConversation }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsSending: (isSending) => set({ isSending }),
  clear: () => set({ messages: [], currentConversation: null }),
}));
