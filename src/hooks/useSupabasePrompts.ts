import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { Prompt } from '@/types';
import { toast } from '@/hooks/use-toast';

export function useSupabasePrompts() {
  const { user } = useAuthContext();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastLoadTime, setLastLoadTime] = useState<number | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load prompts from Supabase
  const loadPrompts = useCallback(async (force = false) => {
    if (!user || (user as any).isGuest) return;
    
    // Skip if recently loaded and not forced
    const now = Date.now();
    if (!force && lastLoadTime && (now - lastLoadTime) < 30000) { // 30 seconds cache
      return;
    }
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_prompts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedPrompts: Prompt[] = data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        content: item.content,
        category: item.category as any || 'general',
        persona: item.persona as any || 'strategist',
        tags: item.tags || [],
        usage_count: item.usage_count || 0,
        version: item.version || 1,
        parent_id: item.parent_id,
        created_at: item.created_at,
        updated_at: item.updated_at,
        heuristics: [],
        variables: [],
        difficulty: 'intermediate',
        estimatedTime: '15 minutes'
      }));

      setPrompts(mappedPrompts);
      setLastLoadTime(now);
      setIsInitialized(true);
    } catch (error) {
      console.error('Error loading prompts:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to load prompts from cloud',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [user, lastLoadTime]);

  // Initialize prompts when user is authenticated
  useEffect(() => {
    if (user && !(user as any).isGuest && !isInitialized) {
      loadPrompts();
    } else if (!user || (user as any).isGuest) {
      // Clear prompts when user signs out
      setPrompts([]);
      setIsInitialized(false);
      setLastLoadTime(null);
    }
  }, [user, isInitialized, loadPrompts]);

  const savePrompt = async (prompt: Omit<Prompt, 'id' | 'created_at' | 'updated_at' | 'version' | 'usage_count'>) => {
    if (!user || (user as any).isGuest) return null;

    try {
      const { data, error } = await supabase
        .from('user_prompts')
        .insert({
          user_id: user.id,
          title: prompt.title,
          description: prompt.description,
          content: prompt.content,
          category: prompt.category,
          persona: prompt.persona,
          tags: prompt.tags,
          parent_id: prompt.parent_id
        })
        .select()
        .single();

      if (error) {
        // Check if this is a duplicate error due to our unique constraint
        if (error.code === '23505' && error.message.includes('unique_user_prompt_content')) {
          toast({ 
            title: 'Prompt already exists', 
            description: 'A prompt with this title and content already exists in your library.',
            variant: 'default'
          });
          return null;
        }
        throw error;
      }

      const newPrompt: Prompt = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        content: data.content,
        category: data.category as any || 'general',
        persona: data.persona as any || 'strategist',
        tags: data.tags || [],
        usage_count: data.usage_count || 0,
        version: data.version || 1,
        parent_id: data.parent_id,
        created_at: data.created_at,
        updated_at: data.updated_at,
        heuristics: prompt.heuristics || [],
        variables: prompt.variables || [],
        difficulty: prompt.difficulty || 'intermediate',
        estimatedTime: prompt.estimatedTime || '15 minutes'
      };

      setPrompts(prev => [newPrompt, ...prev]);
      
      toast({
        title: 'Prompt saved',
        description: `"${newPrompt.title}" has been saved to your library.`
      });

      return newPrompt;
    } catch (error) {
      console.error('Error saving prompt:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to save prompt to cloud',
        variant: 'destructive'
      });
      return null;
    }
  };

  const updatePrompt = async (id: string, updates: Partial<Prompt>) => {
    if (!user || (user as any).isGuest) return;

    try {
      const { error } = await supabase
        .from('user_prompts')
        .update({
          title: updates.title,
          description: updates.description,
          content: updates.content,
          category: updates.category,
          persona: updates.persona,
          tags: updates.tags,
          usage_count: updates.usage_count
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setPrompts(prev => prev.map(prompt =>
        prompt.id === id ? { ...prompt, ...updates, updated_at: new Date().toISOString() } : prompt
      ));
    } catch (error) {
      console.error('Error updating prompt:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to update prompt',
        variant: 'destructive'
      });
    }
  };

  const deletePrompt = async (id: string) => {
    if (!user || (user as any).isGuest) return;

    try {
      const { error } = await supabase
        .from('user_prompts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setPrompts(prev => prev.filter(prompt => prompt.id !== id));
      
      toast({
        title: 'Prompt deleted',
        description: 'The prompt has been permanently deleted from your cloud account.'
      });
    } catch (error) {
      console.error('Error deleting prompt:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to delete prompt',
        variant: 'destructive'
      });
    }
  };

  const refreshPrompts = async () => {
    await loadPrompts(true);
  };

  // External initialization function for preloading
  const initializePrompts = useCallback(() => {
    if (user && !(user as any).isGuest && !isInitialized && !loading) {
      loadPrompts();
    }
  }, [user, isInitialized, loading, loadPrompts]);

  return {
    prompts,
    loading,
    isInitialized,
    savePrompt,
    updatePrompt,
    deletePrompt,
    refreshPrompts,
    initializePrompts
  };
}
