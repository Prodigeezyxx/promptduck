
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePromptStore } from '@/store/promptStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, MoreHorizontal, Copy, Trash2, Edit } from 'lucide-react';
import { PERSONAS, CATEGORIES } from '@/constants';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function PromptLibraryPage() {
  const navigate = useNavigate();
  const { prompts, deletePrompt, duplicatePrompt, setCurrentPrompt, searchPrompts } = usePromptStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Show only the first template
  const singleTemplate = prompts[0];
  
  const filteredPrompts = searchQuery 
    ? searchPrompts(searchQuery)
    : prompts;

  const handleTemplateClick = () => {
    if (singleTemplate) {
      // Set the current prompt with all its content and navigate to generator
      setCurrentPrompt({
        ...singleTemplate,
        // Pre-fill the intent with the template's description
        intent: singleTemplate.description || singleTemplate.title,
        content: singleTemplate.content
      });
      navigate('/app/generator');
    }
  };

  const handleCardClick = (prompt: any) => {
    // Set the current prompt with all its content and navigate to generator
    setCurrentPrompt({
      ...prompt,
      // Ensure we have the full prompt content
      intent: prompt.description || prompt.title,
      content: prompt.content
    });
    navigate('/app/generator');
  };

  const handleNewPrompt = () => {
    // Clear any existing prompt state before creating new
    setCurrentPrompt(null);
    navigate('/app/generator');
  };

  const handleEdit = (prompt: any) => {
    setCurrentPrompt(prompt);
    navigate('/app/generator');
  };

  return (
    <div className="p-3 lg:p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 lg:mb-6 gap-3 lg:gap-4">
        <div className="space-y-1">
          <h1 className="text-xl lg:text-3xl font-bold">Prompt Library</h1>
          <p className="text-sm text-muted-foreground">Start with our template or create your own</p>
        </div>
        <Button 
          onClick={handleNewPrompt}
          className="bg-gradient-to-r from-brand-500 to-blue-600 hover:from-brand-600 hover:to-blue-700 w-full sm:w-auto"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Prompt
        </Button>
      </div>

      {/* Featured Template */}
      {singleTemplate && (
        <div className="mb-6 lg:mb-8">
          <h2 className="text-lg font-semibold mb-3">Featured Template</h2>
          <Card 
            className="cursor-pointer group hover:shadow-lg transition-all duration-200 border border-border/50 bg-gradient-to-br from-brand-50/30 to-purple-50/30 dark:from-brand-900/10 dark:to-purple-900/10"
            onClick={handleTemplateClick}
          >
            <CardHeader className="pb-2 lg:pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base lg:text-lg font-semibold line-clamp-2 mb-1 lg:mb-2">
                    {singleTemplate.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {singleTemplate.description || singleTemplate.content.slice(0, 120) + '...'}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 lg:space-y-3 pt-0">
              <div className="flex items-center flex-wrap gap-1">
                <Badge className="persona-badge text-xs">
                  {PERSONAS[singleTemplate.persona].icon} {PERSONAS[singleTemplate.persona].name}
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {singleTemplate.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="heuristic-tag text-xs px-2 py-1 bg-accent rounded-md">
                    {tag}
                  </span>
                ))}
                {singleTemplate.tags.length > 3 && (
                  <span className="heuristic-tag text-xs px-2 py-1 bg-accent rounded-md">
                    +{singleTemplate.tags.length - 3}
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                <span>Click to use this template</span>
                <span>v{singleTemplate.version}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search */}
      <div className="mb-4 lg:mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Your Prompts */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-3">Your Prompts</h2>
        {filteredPrompts.length > 1 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
            {filteredPrompts.slice(1).map((prompt) => (
              <Card 
                key={prompt.id} 
                className="prompt-card cursor-pointer group hover:shadow-lg transition-all duration-200 border border-border/50"
                onClick={() => handleCardClick(prompt)}
              >
                <CardHeader className="pb-2 lg:pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm lg:text-base font-semibold line-clamp-2 mb-1 lg:mb-2">
                        {prompt.title}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground line-clamp-3">
                        {prompt.description || prompt.content.slice(0, 120) + '...'}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="opacity-0 group-hover:opacity-100 w-8 h-8 p-0 shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(prompt);
                        }}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          duplicatePrompt(prompt.id);
                        }}>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePrompt(prompt.id);
                          }}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 lg:space-y-3 pt-0">
                  <div className="flex items-center flex-wrap gap-1">
                    <Badge className="persona-badge text-xs">
                      {PERSONAS[prompt.persona].icon} {PERSONAS[prompt.persona].name}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {prompt.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="heuristic-tag text-xs px-2 py-1 bg-accent rounded-md">
                        {tag}
                      </span>
                    ))}
                    {prompt.tags.length > 3 && (
                      <span className="heuristic-tag text-xs px-2 py-1 bg-accent rounded-md">
                        +{prompt.tags.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                    <span>Used {prompt.usage_count} times</span>
                    <span>v{prompt.version}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 lg:py-12 border-2 border-dashed border-border rounded-lg">
            <p className="text-muted-foreground mb-4">No custom prompts yet.</p>
            <Button onClick={handleNewPrompt}>Create your first prompt</Button>
          </div>
        )}
      </div>
    </div>
  );
}
