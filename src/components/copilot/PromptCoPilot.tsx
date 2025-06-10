import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Wand2, Brain } from 'lucide-react';
import { coPilotService, CoPilotMessage } from '@/services/coPilotService';
import { PromptAnalysisPanel } from './PromptAnalysisPanel';
import { PromptAnalysis, PromptIteration } from '@/services/promptAnalysisService';
import { toast } from '@/hooks/use-toast';

export function PromptCoPilot() {
  const [messages, setMessages] = useState<CoPilotMessage[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<PromptAnalysis | null>(null);
  const [iterations, setIterations] = useState<PromptIteration[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Initial message from the bot
    const initialMessage: CoPilotMessage = {
      id: 'initial',
      type: 'assistant',
      content: "Hello! I'm your Prompt Co-Pilot. I can help you refine your prompts. Just describe what you want to achieve!",
      timestamp: new Date().toISOString()
    };
    setMessages([initialMessage]);
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim() || isGenerating) return;

    const userMessage = input.trim();
    setInput('');
    setIsGenerating(true);

    // Add user message
    const newUserMessage: CoPilotMessage = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newUserMessage]);

    try {
      // Check if this message involves prompt testing and we should analyze
      const shouldAnalyze = userMessage.toLowerCase().includes('test') || 
                           userMessage.toLowerCase().includes('try') ||
                           messages.some(m => m.metadata?.prompt_used);

      if (shouldAnalyze) {
        setIsAnalyzing(true);
      }

      const response = await coPilotService.processUserMessage(userMessage);
      setMessages(prev => [...prev, response]);

      // If response contains analysis, update the analysis state
      if (response.metadata?.analysis) {
        setCurrentAnalysis(response.metadata.analysis);
        setIterations(coPilotService.getIterations());
      }

      setIsAnalyzing(false);
    } catch (error) {
      console.error('Failed to process message:', error);
      const errorMessage: CoPilotMessage = {
        id: `error_${Date.now()}`,
        type: 'assistant',
        content: 'I encountered an issue processing your request. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsAnalyzing(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyRefinement = async (refinedPrompt: string) => {
    setIsGenerating(true);
    try {
      const response = await coPilotService.processUserMessage(
        `Please use this refined prompt: ${refinedPrompt}`
      );
      setMessages(prev => [...prev, response]);
      
      toast({ 
        title: 'Refined prompt applied!', 
        description: 'The improved version has been loaded.' 
      });
    } catch (error) {
      console.error('Failed to apply refinement:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to apply the refined prompt.' 
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplySuggestion = async (suggestion: string) => {
    setIsGenerating(true);
    try {
      const response = await coPilotService.applyRefinementSuggestion(suggestion);
      setMessages(prev => [...prev, response]);
      
      // Update current analysis if the response contains new analysis
      if (response.metadata?.analysis) {
        setCurrentAnalysis(response.metadata.analysis);
        setIterations(coPilotService.getIterations());
      }
      
      toast({ 
        title: 'Suggestion applied!', 
        description: 'Your prompt has been improved based on the suggestion.' 
      });
    } catch (error) {
      console.error('Failed to apply suggestion:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to apply the suggestion.' 
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const renderMessage = (message: CoPilotMessage) => {
    const isUser = message.type === 'user';
    const avatar = isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-primary-foreground" />;
    const bgColor = isUser ? 'bg-primary' : 'bg-muted';
    const textColor = isUser ? 'text-white' : 'text-foreground';

    return (
      <div key={message.id} className="flex items-start space-x-3">
        <div className={`w-8 h-8 ${bgColor} rounded-full flex items-center justify-center`}>
          {avatar}
        </div>
        <div className="flex-1">
          <div className="bg-muted/30 p-3 rounded-lg">
            <p className={`text-sm ${textColor}`}>{message.content}</p>
            {message.metadata?.prompt_used && (
              <div className="mt-2">
                <Badge variant="secondary" className="mr-1 text-xs">
                  Prompt Used
                </Badge>
                <p className="text-xs text-muted-foreground">{message.metadata.prompt_used}</p>
                {message.metadata.heuristics && message.metadata.heuristics.length > 0 && (
                  <div className="mt-1">
                    <Badge variant="secondary" className="mr-1 text-xs">
                      Heuristics
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {message.metadata.heuristics.join(', ')}
                    </p>
                  </div>
                )}
                {message.metadata?.analysis && (
                  <div className="mt-2">
                    <Badge variant="secondary" className="mr-1 text-xs">
                      Quality Score
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {message.metadata.analysis.quality_score}/10
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-full">
      {/* Chat Interface */}
      <div className="lg:col-span-2 flex flex-col h-full">
        <Card className="flex-1 flex flex-col">
          <CardContent className="p-0 flex-1 flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => renderMessage(message))}
                {isGenerating && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Wand2 className="w-4 h-4 animate-pulse" />
                          <span className="text-sm">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe what you want to achieve..."
                  disabled={isGenerating}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={isGenerating || !input.trim()}
                  size="sm"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Panel */}
      <div className="lg:col-span-1">
        <PromptAnalysisPanel
          analysis={currentAnalysis}
          iterations={iterations}
          onApplyRefinement={handleApplyRefinement}
          onApplySuggestion={handleApplySuggestion}
          isAnalyzing={isAnalyzing}
        />
      </div>
    </div>
  );
}
