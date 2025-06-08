
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Code, Plus, Save, Eye, Trash2, Copy } from 'lucide-react';
import { MASTER_SYSTEM_PROMPT } from '@/constants';
import { SystemPrompt } from '@/types';

export default function SystemEditorPage() {
  const [systemPrompts, setSystemPrompts] = useState<SystemPrompt[]>([
    {
      id: '1',
      name: 'PromptDuck Master',
      content: MASTER_SYSTEM_PROMPT,
      description: 'Core PromptDuck system prompt with cognitive heuristics',
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]);
  
  const [selectedPrompt, setSelectedPrompt] = useState<SystemPrompt | null>(systemPrompts[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    content: ''
  });

  const handleEdit = (prompt: SystemPrompt) => {
    setEditForm({
      name: prompt.name,
      description: prompt.description,
      content: prompt.content
    });
    setIsEditing(true);
    setSelectedPrompt(prompt);
  };

  const handleSave = () => {
    if (selectedPrompt) {
      setSystemPrompts(prompts => 
        prompts.map(p => 
          p.id === selectedPrompt.id 
            ? { ...p, ...editForm, updated_at: new Date().toISOString() }
            : p
        )
      );
      setSelectedPrompt({ ...selectedPrompt, ...editForm });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({ name: '', description: '', content: '' });
  };

  const handleDelete = (id: string) => {
    setSystemPrompts(prompts => prompts.filter(p => p.id !== id));
    if (selectedPrompt?.id === id) {
      setSelectedPrompt(systemPrompts.find(p => p.id !== id) || null);
    }
  };

  const handleToggleActive = (id: string) => {
    setSystemPrompts(prompts => 
      prompts.map(p => 
        p.id === id ? { ...p, active: !p.active } : p
      )
    );
  };

  const handleDuplicate = (prompt: SystemPrompt) => {
    const newPrompt: SystemPrompt = {
      ...prompt,
      id: crypto.randomUUID(),
      name: `${prompt.name} (Copy)`,
      active: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setSystemPrompts(prompts => [...prompts, newPrompt]);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Code className="w-8 h-8 mr-3 text-brand-500" />
            System Editor
          </h1>
          <p className="text-muted-foreground">
            Manage system prompts that shape AI behavior and response patterns
          </p>
        </div>
        <Button className="bg-gradient-to-r from-brand-500 to-purple-600">
          <Plus className="w-4 h-4 mr-2" />
          New System Prompt
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* System Prompts List */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Prompts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {systemPrompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedPrompt?.id === prompt.id 
                      ? 'bg-primary/10 border-primary' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedPrompt(prompt)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">{prompt.name}</h4>
                    <div className="flex items-center space-x-2">
                      {prompt.active && (
                        <Badge className="text-xs px-1 py-0">Active</Badge>
                      )}
                      <Switch
                        checked={prompt.active}
                        onCheckedChange={() => handleToggleActive(prompt.id)}
                        size="sm"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {prompt.description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">
                      {new Date(prompt.updated_at).toLocaleDateString()}
                    </span>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(prompt);
                        }}
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicate(prompt);
                        }}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(prompt.id);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Editor */}
        <div className="lg:col-span-2 space-y-4">
          {selectedPrompt ? (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      {isEditing ? 'Edit System Prompt' : selectedPrompt.name}
                    </CardTitle>
                    <div className="flex space-x-2">
                      {isEditing ? (
                        <>
                          <Button variant="outline" onClick={handleCancel}>
                            Cancel
                          </Button>
                          <Button onClick={handleSave}>
                            <Save className="w-4 h-4 mr-1" />
                            Save
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => handleEdit(selectedPrompt)}>
                          Edit
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Name</label>
                        <Input
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          placeholder="System prompt name"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1 block">Description</label>
                        <Input
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          placeholder="Brief description of this system prompt"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1 block">Content</label>
                        <Textarea
                          value={editForm.content}
                          onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                          placeholder="System prompt content..."
                          rows={15}
                          className="font-mono text-sm"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <h4 className="font-medium mb-2">Description</h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedPrompt.description}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Content</h4>
                        <div className="prompt-editor bg-muted/50 min-h-[400px]">
                          <pre className="whitespace-pre-wrap text-sm">{selectedPrompt.content}</pre>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {!isEditing && (
                <Card>
                  <CardHeader>
                    <CardTitle>Usage Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Created:</span>
                        <span className="ml-2">{new Date(selectedPrompt.created_at).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Modified:</span>
                        <span className="ml-2">{new Date(selectedPrompt.updated_at).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <Badge className={`ml-2 ${selectedPrompt.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {selectedPrompt.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Characters:</span>
                        <span className="ml-2">{selectedPrompt.content.length.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="h-96 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a system prompt to view or edit</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
