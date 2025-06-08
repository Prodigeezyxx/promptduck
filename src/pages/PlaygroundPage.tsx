
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PlayCircle, RotateCcw, Copy, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function PlaygroundPage() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTest = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt to test');
      return;
    }

    setIsLoading(true);
    // Simulate API call using Gemini Pro
    setTimeout(() => {
      setResponse(`[AI Response from Gemini Pro]\n\nThis is where the AI's response would appear when testing your prompt. The actual implementation would integrate with Google's Gemini Pro API to generate real responses.\n\nYour prompt was:\n"${prompt}"`);
      setIsLoading(false);
    }, 2000);
  };

  const handleClear = () => {
    setPrompt('');
    setResponse('');
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    toast.success('Prompt copied to clipboard');
  };

  const handleCopyResponse = () => {
    navigator.clipboard.writeText(response);
    toast.success('Response copied to clipboard');
  };

  const handleSave = () => {
    // In a real app, this would save to history or library
    toast.success('Session saved to history');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center">
          <PlayCircle className="w-8 h-8 mr-3 text-brand-500" />
          Prompt Playground
        </h1>
        <p className="text-muted-foreground">
          Test and experiment with prompts in a simple AI chat interface
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Prompt Input</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt here..."
                className="min-h-[300px] resize-none"
              />
              
              <div className="flex items-center space-x-2">
                <Button 
                  onClick={handleTest}
                  disabled={isLoading || !prompt.trim()}
                  className="flex-1"
                >
                  <PlayCircle className="w-4 h-4 mr-2" />
                  {isLoading ? 'Testing...' : 'Test Prompt'}
                </Button>
                
                <Button variant="outline" onClick={handleCopyPrompt} disabled={!prompt.trim()}>
                  <Copy className="w-4 h-4" />
                </Button>
                
                <Button variant="outline" onClick={handleClear} disabled={!prompt.trim() && !response}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Output Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>AI Response</CardTitle>
                {response && (
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={handleCopyResponse}>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleSave}>
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="min-h-[300px] flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-muted-foreground">Generating response...</p>
                  </div>
                </div>
              ) : response ? (
                <div className="min-h-[300px] bg-muted/50 rounded-md p-4">
                  <pre className="whitespace-pre-wrap text-sm">{response}</pre>
                </div>
              ) : (
                <div className="min-h-[300px] flex items-center justify-center text-muted-foreground">
                  Enter a prompt and click "Test Prompt" to see the AI response
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
