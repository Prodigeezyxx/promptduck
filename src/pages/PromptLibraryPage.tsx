
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUnifiedData } from '@/hooks/useUnifiedData';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { useFeaturedPrompt } from '@/hooks/useFeaturedPrompt';
import { downloadPromptAsJSON } from '@/utils/promptExporter';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Search, Plus, MoreHorizontal, Copy, Trash2, Edit, Zap, Info, Download } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function PromptLibraryPage() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { prompts, savePrompt, syncing, error } = useUnifiedData();
  const { featuredPrompt, forceRotation } = useFeaturedPrompt();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter prompts based on search query
  const filteredPrompts = searchQuery 
    ? prompts.filter(prompt =>
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : prompts;

  const handleFeaturedPromptClick = () => {
    if (featuredPrompt) {
      navigate('/app/generator');
    }
  };

  const handleCardClick = (prompt: any) => {
    navigate('/app/generator');
  };

  const handleNewPrompt = () => {
    navigate('/app/generator');
  };

  const handleEdit = (prompt: any) => {
    navigate('/app/generator');
  };

  const handleDuplicate = async (prompt: any) => {
    const duplicatedPrompt = {
      title: `${prompt.title} (Copy)`,
      description: prompt.description,
      content: prompt.content,
      category: prompt.category,
      persona: prompt.persona,
      tags: prompt.tags,
      heuristics: prompt.heuristics || [],
      variables: prompt.variables || [],
      difficulty: prompt.difficulty || 'intermediate',
      estimatedTime: prompt.estimatedTime || '15 minutes',
      parent_id: prompt.id
    };
    
    try {
      await savePrompt(duplicatedPrompt);
      toast({
        title: "Prompt duplicated",
        description: `"${duplicatedPrompt.title}" has been created.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to duplicate prompt. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (prompt: any) => {
    toast({
      title: "Feature coming soon",
      description: "Delete functionality will be available soon.",
      variant: "default"
    });
  };

  const handleDownloadPrompt = (prompt: any) => {
    downloadPromptAsJSON(prompt);
    toast({
      title: "Download started",
      description: `"${prompt.title}" has been downloaded as a JSON file.`
    });
  };

  // Show error state if there's an error
  if (error) {
    return (
      <div className="p-3 lg:p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 lg:p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 lg:mb-6 gap-3 lg:gap-4">
        <div className="space-y-1">
          <h1 className="text-xl lg:text-3xl font-bold">Prompt Library</h1>
          <p className="text-sm text-muted-foreground">
            {user ? 'Discover curated prompts and manage your collection' : 'Discover curated prompts and create your collection'}
            {syncing && user && (
              <span className="ml-2 text-xs text-brand-600">• Syncing...</span>
            )}
          </p>
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
                    <p className="max-w-xs">Curated prompts that showcase PromptDuck's capabilities. We rotate this every session to help you discover new possibilities.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={forceRotation}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Zap className="w-4 h-4 mr-1" />
                    I'm feeling lucky
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Get a new featured prompt to spark your creativity</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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

      {/* Search - Only show if there are user prompts */}
      {prompts.length > 0 && (
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
      )}

      {/* Your Prompts */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-3">Your Prompts</h2>
        {filteredPrompts.length > 0 ? (
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
                          handleDuplicate(prompt);
                        }}>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadPrompt(prompt);
                        }}>
                          <Download className="w-4 h-4 mr-2" />
                          Download JSON
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(prompt);
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
                    <span>Used {prompt.usage_count || 0} times</span>
                    <span>v{prompt.version || 1}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 lg:py-16 border-2 border-dashed border-border rounded-lg">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-2">No saved prompts yet</h3>
              <p className="text-muted-foreground mb-6">
                {user 
                  ? 'Start creating and saving your own prompts to build your personal library.'
                  : 'Start creating prompts now. Sign in to save them to your personal library.'
                }
                {featuredPrompt && ' You can also try the featured template above to get started.'}
              </p>
              <Button onClick={handleNewPrompt} size="lg">
                <Plus className="w-4 h-4 mr-2" />
                Create your first prompt
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
