
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { useApiKeyStore } from '@/store/apiKeyStore';
import { geminiService } from '@/services/geminiService';
import { useLocation } from 'react-router-dom';
import { usePlaygroundHistory } from './usePlaygroundHistory';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

let messageCounter = 0;

export function usePlaygroundConversation() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const { apiKey } = useApiKeyStore();
  const abortControllerRef = useRef<AbortController | null>(null);
  const location = useLocation();
  
  const {
    conversations,
    currentConversationId,
    saveCurrentConversation,
    loadConversation,
    startNewConversation,
    deleteConversation
  } = usePlaygroundHistory();

  useEffect(() => {
    if (apiKey?.openai) {
      try {
        geminiService.initialize(apiKey.openai);
        console.log('OpenAI service initialized successfully');
      } catch (error) {
        console.error('Failed to initialize OpenAI service:', error);
        toast.error('Failed to initialize AI service');
      }
    }
  }, [apiKey?.openai]);

  useEffect(() => {
    if (location.state?.prefilledPrompt) {
      setCurrentInput(location.state.prefilledPrompt);
      window.history.replaceState({}, '', location.pathname);
    }
  }, [location]);

  // Auto-save conversation when messages change
  useEffect(() => {
    if (messages.length > 0) {
      saveCurrentConversation(messages);
    }
  }, [messages, saveCurrentConversation]);

  const generateUniqueId = () => {
    messageCounter += 1;
    return `msg_${Date.now()}_${messageCounter}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const addMessage = (content: string, type: 'user' | 'ai', isTyping = false) => {
    const newMessage: Message = {
      id: generateUniqueId(),
      type,
      content,
      timestamp: new Date(),
      isTyping
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage.id;
  };

  const updateMessage = (id: string, content: string, isTyping = false) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, content, isTyping } : msg
    ));
  };

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    toast.info('Generation stopped');
  };

  const sendMessage = async (prompt: string) => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt to test');
      return;
    }

    if (!apiKey?.openai) {
      toast.error('OpenAI API key not configured');
      return;
    }

    addMessage(prompt, 'user');
    setCurrentInput('');
    setIsLoading(true);

    abortControllerRef.current = new AbortController();
    const aiMessageId = addMessage('', 'ai', true);

    try {
      geminiService.initialize(apiKey.openai);
      
      const result = await geminiService.generateChatResponse(prompt.trim());
      
      if (abortControllerRef.current?.signal.aborted) {
        updateMessage(aiMessageId, 'Generation was stopped.', false);
        return;
      }
      
      updateMessage(aiMessageId, result, false);
      toast.success('Response generated successfully');
    } catch (error) {
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }
      
      let errorMessage = 'Failed to generate response';
      
      if (error instanceof Error) {
        if (error.message.includes('quota')) {
          errorMessage = 'API quota exceeded. Please try again later.';
        } else if (error.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('not initialized')) {
          errorMessage = 'Service not properly initialized. Please check your API key.';
        } else {
          errorMessage = error.message;
        }
      }
      
      updateMessage(aiMessageId, `Error: ${errorMessage}`, false);
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const clearConversation = () => {
    const clearedMessages = startNewConversation();
    setMessages(clearedMessages);
    setCurrentInput('');
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  const loadConversationById = (conversationId: string) => {
    const loadedMessages = loadConversation(conversationId);
    setMessages(loadedMessages);
    setCurrentInput('');
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Message copied to clipboard');
  };

  return {
    messages,
    isLoading,
    currentInput,
    setCurrentInput,
    sendMessage,
    stopGeneration,
    clearConversation,
    copyMessage,
    isValidKey: !!apiKey?.openai,
    // History functionality
    conversations,
    currentConversationId,
    loadConversationById,
    deleteConversation
  };
}
