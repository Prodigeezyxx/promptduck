
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { toast } from '@/hooks/use-toast';

interface ConversationHistory {
  id: string;
  title: string;
  messages: any[];
  timestamp: Date;
}

export function useSupabaseConversations() {
  const { user } = useAuthContext();
  const [conversations, setConversations] = useState<ConversationHistory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  const loadConversations = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const mappedConversations: ConversationHistory[] = data.map(item => ({
        id: item.id,
        title: item.title || 'Untitled Conversation',
        messages: Array.isArray(item.messages) ? item.messages : [],
        timestamp: new Date(item.updated_at)
      }));

      setConversations(mappedConversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast({ title: 'Error', description: 'Failed to load conversations from cloud' });
    } finally {
      setLoading(false);
    }
  };

  const saveConversation = async (conversationId: string, messages: any[], title?: string) => {
    if (!user || messages.length === 0) return;

    try {
      const conversationTitle = title || messages[0]?.content?.slice(0, 50) + '...' || 'Untitled Conversation';
      
      const { error } = await supabase
        .from('user_conversations')
        .upsert({
          id: conversationId,
          user_id: user.id,
          title: conversationTitle,
          messages,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Update local state
      setConversations(prev => {
        const existing = prev.find(c => c.id === conversationId);
        const updated = {
          id: conversationId,
          title: conversationTitle,
          messages,
          timestamp: new Date()
        };
        
        if (existing) {
          return prev.map(c => c.id === conversationId ? updated : c);
        } else {
          return [updated, ...prev];
        }
      });
    } catch (error) {
      console.error('Error saving conversation:', error);
      toast({ title: 'Error', description: 'Failed to save conversation to cloud' });
    }
  };

  const deleteConversation = async (conversationId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_conversations')
        .delete()
        .eq('id', conversationId)
        .eq('user_id', user.id);

      if (error) throw error;

      setConversations(prev => prev.filter(c => c.id !== conversationId));
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast({ title: 'Error', description: 'Failed to delete conversation' });
    }
  };

  return {
    conversations,
    loading,
    saveConversation,
    deleteConversation,
    refreshConversations: loadConversations
  };
}
