
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
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredPrompts = searchQuery 
    ? searchPrompts(searchQuery)
    : selectedCategory === 'all' 
    ? prompts 
    : prompts.filter(p => p.category === selectedCategory);

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
          <p className="text-sm text-muted-foreground">Manage and organize your prompt collection</p>
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

      {/* Search and Filters */}
      <div className="flex flex-col gap-3 lg:gap-4 mb-4 lg:mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('all')}
            size="sm"
            className="whitespace-nowrap"
          >
            All
          </Button>
          {Object.entries(CATEGORIES).map(([key, category]) => (
            <Button
              key={key}
              variant={selectedCategory === key ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(key)}
              size="sm"
              className="whitespace-nowrap"
            >
              {category.icon} {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
        {filteredPrompts.map((prompt) => (
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

      {filteredPrompts.length === 0 && (
        <div className="text-center py-8 lg:py-12">
          <p className="text-muted-foreground mb-4">No prompts found matching your criteria.</p>
          <Button onClick={handleNewPrompt}>Create your first prompt</Button>
        </div>
      )}
    </div>
  );
}
