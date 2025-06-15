
import { useState, useEffect } from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { useSupabaseConversations } from './useSupabaseConversations';

interface ConversationHistory {
  id: string;
  title: string;
  messages: any[];
  timestamp: Date;
}

export function usePlaygroundHistory() {
  const { user } = useAuthContext();
  const { conversations, saveConversation, deleteConversation } = useSupabaseConversations();
  const [localConversations, setLocalConversations] = useState<ConversationHistory[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  // Load localStorage conversations for unauthenticated users
  useEffect(() => {
    if (!user) {
      const stored = localStorage.getItem('promptduck-playground-history');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setLocalConversations(parsed.map((conv: any) => ({
            ...conv,
            timestamp: new Date(conv.timestamp)
          })));
        } catch (error) {
          console.error('Failed to load conversation history:', error);
        }
      }
    }
  }, [user]);

  const activeConversations = user ? conversations : localConversations;

  const saveLocalConversations = (convs: ConversationHistory[]) => {
    localStorage.setItem('promptduck-playground-history', JSON.stringify(convs));
    setLocalConversations(convs);
  };

  const saveCurrentConversation = (messages: any[]) => {
    if (messages.length === 0) return;

    const conversationId = currentConversationId || `conv_${Date.now()}`;
    const title = messages[0]?.content?.slice(0, 50) + '...' || 'Untitled Conversation';

    if (user) {
      // Save to Supabase for authenticated users
      saveConversation(conversationId, messages, title);
    } else {
      // Save to localStorage for unauthenticated users
      const conversation: ConversationHistory = {
        id: conversationId,
        title,
        messages,
        timestamp: new Date()
      };

      const updated = localConversations.filter(c => c.id !== conversationId);
      updated.unshift(conversation);
      
      saveLocalConversations(updated.slice(0, 50)); // Keep last 50 conversations
    }
    
    setCurrentConversationId(conversationId);
  };

  const loadConversation = (conversationId: string): any[] => {
    const conversation = activeConversations.find(c => c.id === conversationId);
    if (conversation) {
      setCurrentConversationId(conversationId);
      return conversation.messages;
    }
    return [];
  };

  const startNewConversation = () => {
    setCurrentConversationId(null);
    return [];
  };

  const handleDeleteConversation = (conversationId: string) => {
    if (user) {
      // Delete from Supabase for authenticated users
      deleteConversation(conversationId);
    } else {
      // Delete from localStorage for unauthenticated users
      const updated = localConversations.filter(c => c.id !== conversationId);
      saveLocalConversations(updated);
    }
    
    if (currentConversationId === conversationId) {
      setCurrentConversationId(null);
    }
  };

  return {
    conversations: activeConversations,
    currentConversationId,
    saveCurrentConversation,
    loadConversation,
    startNewConversation,
    deleteConversation: handleDeleteConversation
  };
}
