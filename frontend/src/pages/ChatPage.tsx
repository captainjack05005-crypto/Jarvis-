import React, { useEffect, useState, useCallback } from 'react';
import { useChatStore } from '@/store/chat';
import { useAuthStore } from '@/store/auth';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import ChatArea from '@/components/ChatArea';
import ChatInput from '@/components/ChatInput';
import { HUDPanel } from '@/components/HUD';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const ChatPage: React.FC = () => {
  const {
    conversations,
    currentConversation,
    messages,
    isLoading,
    isSending,
    setConversations,
    setCurrentConversation,
    setMessages,
    addMessage,
    setIsLoading,
    setIsSending,
  } = useChatStore();

  const { user } = useAuthStore();
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);

  // Load conversations on mount
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const response = await api.get('/chat/conversations');
        setConversations(response.data);
      } catch (error) {
        console.error('Failed to load conversations:', error);
      }
    };

    loadConversations();
  }, [setConversations]);

  // Load messages when conversation changes
  useEffect(() => {
    if (currentConversation) {
      const loadMessages = async () => {
        try {
          setIsLoading(true);
          const response = await api.get(
            `/chat/conversations/${currentConversation.id}`
          );
          setMessages(response.data.messages || []);
        } catch (error) {
          console.error('Failed to load messages:', error);
        } finally {
          setIsLoading(false);
        }
      };

      loadMessages();
    }
  }, [currentConversation, setMessages, setIsLoading]);

  const handleNewChat = async () => {
    try {
      const response = await api.post('/chat/conversations', {
        title: `Chat - ${new Date().toLocaleDateString()}`,
      });
      const newConversation = response.data;
      setConversations([newConversation, ...conversations]);
      setCurrentConversation(newConversation);
      setMessages([]);
    } catch (error) {
      toast.error('Failed to create conversation');
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!currentConversation || !message.trim()) return;

    try {
      setIsSending(true);

      // Add user message immediately
      const userMessage = {
        id: Date.now().toString(),
        role: 'user' as const,
        content: message,
        created_at: new Date().toISOString(),
      };
      addMessage(userMessage);

      // Send to API
      const response = await api.post('/chat/message', {
        message,
        conversation_id: currentConversation.id,
      });

      // Add assistant message
      addMessage(response.data.assistant_message);

      // Update conversation if it doesn't have a title
      if (!currentConversation.title) {
        const updatedConversation = {
          ...currentConversation,
          title: response.data.conversation.title,
        };
        setCurrentConversation(updatedConversation);
        setConversations(
          conversations.map((c) =>
            c.id === updatedConversation.id ? updatedConversation : c
          )
        );
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleVoiceStart = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success('Recording started...');
    } catch (error) {
      toast.error('Failed to access microphone');
    }
  };

  const handleVoiceStop = async () => {
    if (!mediaRecorderRef.current) return;

    try {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/wav',
        });
        audioChunksRef.current = [];

        // Send audio for transcription
        const formData = new FormData();
        formData.append('file', audioBlob, 'recording.wav');

        const response = await api.post('/voice/transcribe', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        toast.success(`Transcribed: ${response.data.text}`);
        handleSendMessage(response.data.text);
      };
    } catch (error) {
      toast.error('Failed to process voice');
    }
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      await api.delete(`/chat/conversations/${id}`);
      setConversations(conversations.filter((c) => c.id !== id));
      if (currentConversation?.id === id) {
        setCurrentConversation(null);
        setMessages([]);
      }
      toast.success('Conversation deleted');
    } catch (error) {
      toast.error('Failed to delete conversation');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navbar onNewChat={handleNewChat} />

      <div className="flex-1 flex overflow-hidden mt-16">
        <Sidebar
          conversations={conversations}
          currentConversation={currentConversation}
          onSelectConversation={setCurrentConversation}
          onDeleteConversation={handleDeleteConversation}
        />

        <div className="flex-1 flex flex-col">
          <ChatArea messages={messages} isLoading={isLoading} />
          <ChatInput
            onSendMessage={handleSendMessage}
            onVoiceStart={handleVoiceStart}
            onVoiceStop={handleVoiceStop}
            isLoading={isSending}
            isRecording={isRecording}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
