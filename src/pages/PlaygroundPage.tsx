
import { useState } from 'react';
import { usePromptStore } from '@/store/promptStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlayCircle, Save, Share, RotateCcw } from 'lucide-react';
import { PERSONAS } from '@/constants';
import { Prompt, PromptVariable } from '@/types';

export default function PlaygroundPage() {
  const { prompts, incrementUsage } = usePromptStore();
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [compiledPrompt, setCompiledPrompt] = useState('');
  const [result, setResult] = useState('');

  const handlePromptSelect = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    const defaultVariables: Record<string, string> = {};
    prompt.variables.forEach(variable => {
      defaultVariables[variable.name] = variable.default || '';
    });
    setVariables(defaultVariables);
    compilePrompt(prompt, defaultVariables);
  };

  const compilePrompt = (prompt: Prompt, vars: Record<string, string>) => {
    let compiled = prompt.content;
    prompt.variables.forEach(variable => {
      const value = vars[variable.name] || `{${variable.name}}`;
      compiled = compiled.replace(new RegExp(`\\{${variable.name}\\}`, 'g'), value);
    });
    setCompiledPrompt(compiled);
  };

  const handleVariableChange = (name: string, value: string) => {
    const newVariables = { ...variables, [name]: value };
    setVariables(newVariables);
    if (selectedPrompt) {
      compilePrompt(selectedPrompt, newVariables);
    }
  };

  const handleTest = () => {
    if (selectedPrompt) {
      incrementUsage(selectedPrompt.id);
      // In a real app, this would send to an AI service
      setResult(`[Simulated AI Response for: ${selectedPrompt.title}]\n\nThis is where the AI's response would appear when using your compiled prompt. The actual implementation would integrate with your preferred AI service (OpenAI, Anthropic, Google, etc.) to generate real responses.`);
    }
  };

  const handleReset = () => {
    if (selectedPrompt) {
      const defaultVariables: Record<string, string> = {};
      selectedPrompt.variables.forEach(variable => {
        defaultVariables[variable.name] = variable.default || '';
      });
      setVariables(defaultVariables);
      compilePrompt(selectedPrompt, defaultVariables);
      setResult('');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center">
          <PlayCircle className="w-8 h-8 mr-3 text-brand-500" />
          Prompt Playground
        </h1>
        <p className="text-muted-foreground">
          Test and refine your prompts with different variables and see live results
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Prompt Selection */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Select Prompt</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedPrompt?.id || ''} onValueChange={(value) => {
                const prompt = prompts.find(p => p.id === value);
                if (prompt) handlePromptSelect(prompt);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a prompt to test" />
                </SelectTrigger>
                <SelectContent>
                  {prompts.map((prompt) => (
                    <SelectItem key={prompt.id} value={prompt.id}>
                      <div className="flex items-center space-x-2">
                        <span>{PERSONAS[prompt.persona].icon}</span>
                        <span className="truncate">{prompt.title}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedPrompt && (
            <Card>
              <CardHeader>
                <CardTitle>Prompt Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Badge className="persona-badge">
                    {PERSONAS[selectedPrompt.persona].icon} {PERSONAS[selectedPrompt.persona].name}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {selectedPrompt.description}
                </p>
                
                <div className="flex flex-wrap gap-1">
                  {selectedPrompt.tags.map((tag) => (
                    <span key={tag} className="heuristic-tag">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Used {selectedPrompt.usage_count} times • v{selectedPrompt.version}
                </div>
              </CardContent>
            </Card>
          )}

          {selectedPrompt && selectedPrompt.variables.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Variables</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedPrompt.variables.map((variable) => (
                  <div key={variable.name}>
                    <label className="text-sm font-medium mb-1 block">
                      {variable.name}
                      {variable.required && <span className="text-destructive ml-1">*</span>}
                    </label>
                    {variable.description && (
                      <p className="text-xs text-muted-foreground mb-2">
                        {variable.description}
                      </p>
                    )}
                    {variable.type === 'textarea' ? (
                      <Textarea
                        value={variables[variable.name] || ''}
                        onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                        placeholder={variable.default}
                        rows={3}
                      />
                    ) : variable.type === 'select' && variable.options ? (
                      <Select 
                        value={variables[variable.name] || ''} 
                        onValueChange={(value) => handleVariableChange(variable.name, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          {variable.options.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        value={variables[variable.name] || ''}
                        onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                        placeholder={variable.default}
                        type={variable.type === 'number' ? 'number' : 'text'}
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Compiled Prompt */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Compiled Prompt</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reset
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleTest}
                    disabled={!selectedPrompt}
                  >
                    <PlayCircle className="w-4 h-4 mr-1" />
                    Test
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {compiledPrompt ? (
                <div className="prompt-editor bg-muted/50 min-h-[300px]">
                  <pre className="whitespace-pre-wrap text-sm">{compiledPrompt}</pre>
                </div>
              ) : (
                <div className="prompt-editor min-h-[300px] flex items-center justify-center text-muted-foreground">
                  Select a prompt to see the compiled version
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>AI Response</CardTitle>
                {result && (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="prompt-editor bg-muted/50 min-h-[300px]">
                  <pre className="whitespace-pre-wrap text-sm">{result}</pre>
                </div>
              ) : (
                <div className="prompt-editor min-h-[300px] flex items-center justify-center text-muted-foreground">
                  Click "Test" to see AI response
                </div>
              )}
            </CardContent>
          </Card>
          
          {result && (
            <Card>
              <CardHeader>
                <CardTitle>Session Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Rate this response
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Add to favorites
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Create variation
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Export session
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
