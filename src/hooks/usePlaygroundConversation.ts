
import { useState } from 'react';
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

export function usePlaygroundConversation() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const { apiKey, isValidKey } = useApiKeyStore();

  const addMessage = (content: string, type: 'user' | 'ai', isTyping = false) => {
    const newMessage: Message = {
      id: Date.now().toString(),
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

  const sendMessage = async (prompt: string) => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt to test');
      return;
    }

    if (!isValidKey()) {
      toast.error('Please configure a valid API key in Settings');
      return;
    }

    // Add user message
    addMessage(prompt, 'user');
    setCurrentInput('');
    setIsLoading(true);

    // Add AI message with typing indicator
    const aiMessageId = addMessage('', 'ai', true);

    try {
      geminiService.initialize(apiKey!.gemini);
      const model = geminiService['genAI']?.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
      
      if (!model) {
        throw new Error('Failed to initialize Gemini model');
      }
      
      const result = await model.generateContent(prompt);
      const aiResponse = await result.response;
      const text = aiResponse.text();
      
      updateMessage(aiMessageId, text, false);
      toast.success('Response generated successfully');
    } catch (error) {
      console.error('Gemini API error:', error);
      let errorMessage = 'Failed to generate response';
      
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          errorMessage = 'Invalid API key. Please check your Gemini API key in Settings.';
        } else if (error.message.includes('quota')) {
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
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setCurrentInput('');
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
    clearConversation,
    copyMessage,
    isValidKey: isValidKey()
  };
}
