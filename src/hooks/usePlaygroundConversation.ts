
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { useApiKeyStore } from '@/store/apiKeyStore';
import { geminiService } from '@/services/geminiService';

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

  const cleanMarkdownFormatting = (text: string): string => {
    // Remove asterisks used for bold/italic
    let cleaned = text.replace(/\*\*(.*?)\*\*/g, '$1'); // Remove **bold**
    cleaned = cleaned.replace(/\*(.*?)\*/g, '$1'); // Remove *italic*
    
    // Clean up other markdown formatting
    cleaned = cleaned.replace(/#{1,6}\s*/g, ''); // Remove headers
    cleaned = cleaned.replace(/`{3}[\s\S]*?`{3}/g, ''); // Remove code blocks
    cleaned = cleaned.replace(/`([^`]*)`/g, '$1'); // Remove inline code
    cleaned = cleaned.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1'); // Remove links, keep text
    
    // Clean up extra whitespace
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n'); // Max 2 line breaks
    cleaned = cleaned.trim();
    
    return cleaned;
  };

  const sendMessage = async (prompt: string) => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt to test');
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
      geminiService.initialize(apiKey!.gemini);
      const model = geminiService['genAI']?.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
      
      if (!model) {
        throw new Error('Failed to initialize Gemini model');
      }
      
      const result = await model.generateContent(prompt);
      
      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        updateMessage(aiMessageId, 'Generation was stopped.', false);
        return;
      }
      
      const aiResponse = await result.response;
      const text = aiResponse.text();
      
      // Clean the text formatting
      const cleanedText = cleanMarkdownFormatting(text);
      
      updateMessage(aiMessageId, cleanedText, false);
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
    isValidKey: true // Always true since we have hardcoded key
  };
}
