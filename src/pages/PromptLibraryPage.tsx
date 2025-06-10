
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePromptStore } from '@/store/promptStore';
import { useFeaturedPrompt } from '@/hooks/useFeaturedPrompt';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Search, Plus, MoreHorizontal, Copy, Trash2, Edit, RotateCcw, Info } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function PromptLibraryPage() {
  const navigate = useNavigate();
  const { prompts, deletePrompt, duplicatePrompt, setCurrentPrompt, searchPrompts, trackFeaturedPromptView, trackFeaturedPromptClick } = usePromptStore();
  const { featuredPrompt, forceRotation } = useFeaturedPrompt();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPrompts = searchQuery 
    ? searchPrompts(searchQuery)
    : prompts;

  // User prompts exclude the featured prompt
  const userPrompts = filteredPrompts.filter(p => p.id !== featuredPrompt?.id);

  // Track featured prompt view when it's displayed
  useEffect(() => {
    if (featuredPrompt) {
      trackFeaturedPromptView(featuredPrompt.id);
    }
  }, [featuredPrompt, trackFeaturedPromptView]);

  const handleFeaturedPromptClick = () => {
    if (featuredPrompt) {
      trackFeaturedPromptClick(featuredPrompt.id);
      setCurrentPrompt(featuredPrompt);
      navigate('/app/generator');
    }
  };

  const handleCardClick = (prompt: any) => {
    setCurrentPrompt(prompt);
    navigate('/app/generator');
  };

  const handleNewPrompt = () => {
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
          <p className="text-sm text-muted-foreground">Discover powerful prompts that rotate every session</p>
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
      {featuredPrompt && (
        <div className="mb-6 lg:mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Featured Template</h2>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">We rotate this prompt every time you open PromptDuck. It's a quick way to discover what you can build.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={forceRotation}
              className="text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Rotate
            </Button>
          </div>
          
          <Card 
            className="cursor-pointer group hover:shadow-lg transition-all duration-200 border border-border/50 bg-gradient-to-br from-brand-50/30 to-purple-50/30 dark:from-brand-900/10 dark:to-purple-900/10 relative overflow-hidden"
            onClick={handleFeaturedPromptClick}
          >
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300">
                Featured
              </Badge>
            </div>
            
            <CardHeader className="pb-2 lg:pb-3">
              <div className="flex items-start justify-between gap-2 pr-16">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base lg:text-lg font-semibold line-clamp-2 mb-1 lg:mb-2">
                    {featuredPrompt.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {featuredPrompt.description || featuredPrompt.content.slice(0, 120) + '...'}
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-2 lg:space-y-3 pt-0">
              <div className="flex flex-wrap gap-1">
                {featuredPrompt.tags.slice(0, 4).map((tag) => (
                  <span key={tag} className="heuristic-tag text-xs px-2 py-1 bg-accent rounded-md">
                    {tag}
                  </span>
                ))}
                {featuredPrompt.tags.length > 4 && (
                  <span className="heuristic-tag text-xs px-2 py-1 bg-accent rounded-md">
                    +{featuredPrompt.tags.length - 4}
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Click to use this template
                </span>
                <span>v{featuredPrompt.version}</span>
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
        {userPrompts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
            {userPrompts.map((prompt) => (
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
            <p className="text-muted-foreground mb-4">Your saved prompts appear here</p>
            <Button onClick={handleNewPrompt}>Create your first prompt</Button>
          </div>
        )}
      </div>
    </div>
  );
}
