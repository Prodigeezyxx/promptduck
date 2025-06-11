
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { useApiKeyStore } from '@/store/apiKeyStore';
import { geminiService } from '@/services/geminiService';
import { useLocation } from 'react-router-dom';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

// Counter to ensure unique IDs even for rapid successive calls
let messageCounter = 0;

export function usePlaygroundConversation() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const { apiKey } = useApiKeyStore();
  const abortControllerRef = useRef<AbortController | null>(null);
  const location = useLocation();

  // Check for pre-filled input from navigation state
  useEffect(() => {
    if (location.state?.prefilledPrompt) {
      setCurrentInput(location.state.prefilledPrompt);
      // Clear the state to prevent re-setting on subsequent renders
      window.history.replaceState({}, '', location.pathname);
    }
  }, [location]);

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

    if (!apiKey?.gemini) {
      toast.error('Gemini API key not configured');
      return;
    }

    // Add user message
    addMessage(prompt, 'user');
    setCurrentInput('');
    setIsLoading(true);

    // Create abort controller for this request
    abortControllerRef.current = new AbortController();

    // Add AI message with typing indicator
    const aiMessageId = addMessage('', 'ai', true);

    try {
      // Initialize the service
      geminiService.initialize(apiKey.gemini);
      
      // Simple playground prompt - just answer the question directly and helpfully
      const playgroundPrompt = `Answer this question directly and helpfully: ${prompt.trim()}`;

      const result = await geminiService.generateChatResponse(playgroundPrompt);
      
      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        updateMessage(aiMessageId, 'Generation was stopped.', false);
        return;
      }
      
      // Display the direct response
      updateMessage(aiMessageId, result, false);
      toast.success('Response generated successfully');
    } catch (error) {
      console.error('Gemini API error:', error);
      
      // Don't show error if request was aborted
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
    setMessages([]);
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
    isValidKey: !!apiKey?.gemini
  };
}
