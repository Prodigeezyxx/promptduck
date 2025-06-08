
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Save, RefreshCw, Download, Upload, Settings } from 'lucide-react';

export default function SystemEditorPage() {
  const [systemPrompt, setSystemPrompt] = useState(`You are an expert AI assistant designed to help users create, refine, and optimize prompts for various AI models. Your role is to:

1. Analyze user intent and context
2. Structure prompts for maximum clarity and effectiveness
3. Suggest improvements and alternatives
4. Provide detailed explanations of prompt engineering techniques

Always be helpful, precise, and creative in your responses.`);

  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2000);
  const [topP, setTopP] = useState(0.9);
  const [frequencyPenalty, setFrequencyPenalty] = useState(0);
  const [presencePenalty, setPresencePenalty] = useState(0);
  
  const [enableStreaming, setEnableStreaming] = useState(true);
  const [enableMemory, setEnableMemory] = useState(false);
  const [enableTools, setEnableTools] = useState(true);

  const [customVariables, setCustomVariables] = useState([
    { key: 'USER_ROLE', value: 'developer', description: 'The role of the user' },
    { key: 'TASK_TYPE', value: 'creative', description: 'Type of task being performed' }
  ]);

  const presetTemplates = [
    {
      name: 'Creative Writing',
      description: 'Optimized for creative content generation',
      prompt: 'You are a creative writing assistant...'
    },
    {
      name: 'Code Review',
      description: 'Focused on code analysis and improvement',
      prompt: 'You are a senior software engineer...'
    },
    {
      name: 'Research Assistant',
      description: 'Designed for research and analysis tasks',
      prompt: 'You are a thorough research assistant...'
    }
  ];

  const handleSave = () => {
    console.log('Saving system prompt configuration...');
    // Implementation for saving
  };

  const handleReset = () => {
    setSystemPrompt('');
    setTemperature(0.7);
    setMaxTokens(2000);
    // Reset other parameters
  };

  const handleExport = () => {
    const config = {
      systemPrompt,
      parameters: {
        temperature,
        maxTokens,
        topP,
        frequencyPenalty,
        presencePenalty
      },
      settings: {
        enableStreaming,
        enableMemory,
        enableTools
      },
      customVariables
    };
    
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'system-prompt-config.json';
    a.click();
  };

  const addCustomVariable = () => {
    setCustomVariables([
      ...customVariables,
      { key: '', value: '', description: '' }
    ]);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Editor</h1>
          <p className="text-muted-foreground">
            Configure system prompts and AI behavior parameters
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Prompt</CardTitle>
              <CardDescription>
                Define the AI's behavior, role, and instructions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="Enter your system prompt here..."
                className="min-h-[300px] font-mono text-sm"
              />
              <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                <span>{systemPrompt.length} characters</span>
                <span>≈ {Math.ceil(systemPrompt.length / 4)} tokens</span>
              </div>
            </CardContent>
          </Card>

          {/* Custom Variables */}
          <Card>
            <CardHeader>
              <CardTitle>Custom Variables</CardTitle>
              <CardDescription>
                Define reusable variables for your system prompt
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {customVariables.map((variable, index) => (
                <div key={index} className="grid grid-cols-3 gap-2">
                  <Input
                    placeholder="Variable Key"
                    value={variable.key}
                    onChange={(e) => {
                      const updated = [...customVariables];
                      updated[index].key = e.target.value;
                      setCustomVariables(updated);
                    }}
                  />
                  <Input
                    placeholder="Value"
                    value={variable.value}
                    onChange={(e) => {
                      const updated = [...customVariables];
                      updated[index].value = e.target.value;
                      setCustomVariables(updated);
                    }}
                  />
                  <Input
                    placeholder="Description"
                    value={variable.description}
                    onChange={(e) => {
                      const updated = [...customVariables];
                      updated[index].description = e.target.value;
                      setCustomVariables(updated);
                    }}
                  />
                </div>
              ))}
              <Button variant="outline" onClick={addCustomVariable}>
                Add Variable
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Parameters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                AI Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Temperature: {temperature}</Label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Max Tokens: {maxTokens}</Label>
                <input
                  type="range"
                  min="100"
                  max="4000"
                  step="100"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Top P: {topP}</Label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={topP}
                  onChange={(e) => setTopP(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <Label htmlFor="streaming">Enable Streaming</Label>
                <Switch
                  id="streaming"
                  checked={enableStreaming}
                  onCheckedChange={setEnableStreaming}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="memory">Enable Memory</Label>
                <Switch
                  id="memory"
                  checked={enableMemory}
                  onCheckedChange={setEnableMemory}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="tools">Enable Tools</Label>
                <Switch
                  id="tools"
                  checked={enableTools}
                  onCheckedChange={setEnableTools}
                />
              </div>
            </CardContent>
          </Card>

          {/* Preset Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Preset Templates</CardTitle>
              <CardDescription>
                Quick start with pre-configured prompts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {presetTemplates.map((template, index) => (
                <div key={index} className="p-3 border rounded-lg hover:bg-accent cursor-pointer">
                  <div className="font-medium">{template.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {template.description}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Character Count</span>
                <Badge variant="secondary">{systemPrompt.length}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Estimated Tokens</span>
                <Badge variant="secondary">{Math.ceil(systemPrompt.length / 4)}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Variables Used</span>
                <Badge variant="secondary">{customVariables.length}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
