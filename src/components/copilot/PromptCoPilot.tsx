
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Sparkles, Copy, Save } from 'lucide-react';
import { usePromptStore } from '@/store/promptStore';
import { useCreditStore } from '@/store/creditStore';
import { useApiKeyStore } from '@/store/apiKeyStore';
import { coPilotService } from '@/services/coPilotService';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  promptPreview?: string;
  generatedResponse?: string;
  tags?: string[];
}

export function PromptCoPilot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addPrompt } = usePromptStore();
  const { useCredit, canUseCredit } = useCreditStore();
  const { apiKey } = useApiKeyStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initial greeting message
    if (messages.length === 0) {
      const initialMessage: ChatMessage = {
        id: '1',
        role: 'assistant',
        content: "Hi! I'm your Prompt Co-Pilot. I'll help you create powerful AI prompts through conversation. What would you like to achieve today?",
        timestamp: new Date()
      };
      setMessages([initialMessage]);
    }
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    if (!apiKey) {
      toast({ title: 'Error', description: 'Please set up your API key first' });
      return;
    }

    if (!canUseCredit()) {
      toast({ title: 'Daily limit reached', description: 'You\'ve used all your credits today. They reset daily.' });
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    try {
      useCredit();
      
      // Initialize service with API key
      coPilotService.initialize(apiKey.gemini);
      
      // Get AI response based on conversation history
      const response = await coPilotService.processMessage(inputValue, messages);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        promptPreview: response.promptPreview,
        generatedResponse: response.generatedResponse,
        tags: response.tags
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      if (response.promptPreview) {
        setCurrentPrompt(response.promptPreview);
      }
      
      if (response.generatedResponse) {
        setAiResponse(response.generatedResponse);
      }

    } catch (error) {
      console.error('Co-pilot error:', error);
      toast({ title: 'Error', description: 'Failed to process your message. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyPrompt = () => {
    if (currentPrompt) {
      navigator.clipboard.writeText(currentPrompt);
      toast({ title: 'Copied!', description: 'Prompt copied to clipboard.' });
    }
  };

  const handleSavePrompt = () => {
    if (!currentPrompt) return;

    addPrompt({
      title: `Co-Pilot Generated: ${new Date().toLocaleDateString()}`,
      content: currentPrompt,
      description: 'Generated through Co-Pilot conversation',
      tags: ['co-pilot-generated'],
      persona: 'strategist',
      heuristics: ['multi_role_collision'],
      variables: [],
      category: 'general'
    });

    toast({ title: 'Saved!', description: 'Prompt added to your library.' });
  };

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto p-4 lg:p-6">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold flex items-center">
          <Sparkles className="w-6 h-6 lg:w-8 lg:h-8 mr-2 lg:mr-3 text-brand-500" />
          Prompt Co-Pilot
        </h1>
        <p className="text-sm lg:text-base text-muted-foreground">
          Your intelligent assistant for creating powerful AI prompts through conversation
        </p>
      </div>

      <div className="flex-1 grid lg:grid-cols-2 gap-6 min-h-0">
        {/* Chat Interface */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bot className="w-5 h-5 mr-2" />
              Conversation
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-4 min-h-0">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg p-3",
                      message.role === 'user'
                        ? "bg-brand-500 text-white"
                        : "bg-muted"
                    )}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      {message.role === 'assistant' ? (
                        <Bot className="w-4 h-4 mt-0.5 text-brand-500" />
                      ) : (
                        <User className="w-4 h-4 mt-0.5" />
                      )}
                      <div className="text-sm font-medium">
                        {message.role === 'assistant' ? 'Co-Pilot' : 'You'}
                      </div>
                    </div>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </div>
                    {message.tags && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {message.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-brand-500" />
                      <div className="text-sm">Co-Pilot is thinking...</div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe what you want to achieve..."
                className="flex-1 min-h-[60px] resize-none"
                disabled={isProcessing}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isProcessing}
                size="lg"
                className="self-end"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview Panel */}
        <div className="space-y-6">
          {/* Current Prompt */}
          {currentPrompt && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Generated Prompt</CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={handleCopyPrompt}>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleSavePrompt}>
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 p-4 rounded-lg border">
                  <div className="prose prose-sm max-w-none text-foreground">
                    {currentPrompt.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 last:mb-0 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Response Preview */}
          {aiResponse && (
            <Card>
              <CardHeader>
                <CardTitle>AI Response Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 p-4 rounded-lg border">
                  <div className="prose prose-sm max-w-none text-foreground">
                    {aiResponse.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 last:mb-0 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Help Card */}
          {!currentPrompt && !aiResponse && (
            <Card>
              <CardHeader>
                <CardTitle>How it works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-brand-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <div>
                      <div className="font-medium">Describe your goal</div>
                      <div className="text-sm text-muted-foreground">Tell me what you want to achieve with AI</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-brand-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <div>
                      <div className="font-medium">Answer my questions</div>
                      <div className="text-sm text-muted-foreground">I'll ask clarifying questions to understand your needs</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-brand-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </div>
                    <div>
                      <div className="font-medium">Get your prompt</div>
                      <div className="text-sm text-muted-foreground">I'll create and test the perfect prompt for you</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
