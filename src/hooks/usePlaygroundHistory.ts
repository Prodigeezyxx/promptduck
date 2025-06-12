
import { useState, useEffect } from 'react';

interface ConversationHistory {
  id: string;
  title: string;
  messages: any[];
  timestamp: Date;
}

export function usePlaygroundHistory() {
  const [conversations, setConversations] = useState<ConversationHistory[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('promptduck-playground-history');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setConversations(parsed.map((conv: any) => ({
          ...conv,
          timestamp: new Date(conv.timestamp)
        })));
      } catch (error) {
        console.error('Failed to load conversation history:', error);
      }
    }
  }, []);

  const saveConversations = (convs: ConversationHistory[]) => {
    localStorage.setItem('promptduck-playground-history', JSON.stringify(convs));
    setConversations(convs);
  };

  const saveCurrentConversation = (messages: any[]) => {
    if (messages.length === 0) return;

    const conversationId = currentConversationId || `conv_${Date.now()}`;
    const title = messages[0]?.content?.slice(0, 50) + '...' || 'Untitled Conversation';
    
    const conversation: ConversationHistory = {
      id: conversationId,
      title,
      messages,
      timestamp: new Date()
    };

    const updated = conversations.filter(c => c.id !== conversationId);
    updated.unshift(conversation);
    
    saveConversations(updated.slice(0, 50)); // Keep last 50 conversations
    setCurrentConversationId(conversationId);
  };

  const loadConversation = (conversationId: string): any[] => {
    const conversation = conversations.find(c => c.id === conversationId);
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

  const deleteConversation = (conversationId: string) => {
    const updated = conversations.filter(c => c.id !== conversationId);
    saveConversations(updated);
    if (currentConversationId === conversationId) {
      setCurrentConversationId(null);
    }
  };

  return {
    conversations,
    currentConversationId,
    saveCurrentConversation,
    loadConversation,
    startNewConversation,
    deleteConversation
  };
}
