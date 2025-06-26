import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUnifiedData } from '@/hooks/useUnifiedData';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { useFeaturedPrompt } from '@/hooks/useFeaturedPrompt';
import { downloadPromptAsJSON } from '@/utils/promptExporter';
import { useToast } from '@/hooks/use-toast';
import { usePromptStore } from '@/store/promptStore';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { LibraryHeader } from '@/components/library/LibraryHeader';
import { FeaturedPromptCard } from '@/components/library/FeaturedPromptCard';
import { SearchBar } from '@/components/library/SearchBar';
import { PromptCard } from '@/components/library/PromptCard';
import { EmptyState } from '@/components/library/EmptyState';

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PromptLibraryPage() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { prompts, savePrompt, error, syncing } = useUnifiedData();
  const { featuredPrompt, forceRotation } = useFeaturedPrompt();
  const { setCurrentPrompt } = usePromptStore();
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
      <LibraryHeader 
        isAuthenticated={!!user}
        onNewPrompt={handleNewPrompt}
      />

      {/* Featured Template */}
      {featuredPrompt && (
        <FeaturedPromptCard
          prompt={featuredPrompt}
          onPromptClick={handleFeaturedPromptClick}
          onForceRotation={forceRotation}
        />
      )}

      {/* Search - Only show if there are user prompts or if still loading */}
      {(prompts.length > 0 || syncing) && (
        <SearchBar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      )}

      {/* Your Prompts */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-3">Your Prompts ({filteredPrompts.length})</h2>
        
        {/* Show loading skeleton only for very brief initial load */}
        {syncing && prompts.length === 0 ? (
          <LoadingSkeleton />
        ) : filteredPrompts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
            {filteredPrompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onCardClick={handleCardClick}
                onEdit={handleEdit}
                onDuplicate={handleDuplicate}
                onDownload={handleDownloadPrompt}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            isAuthenticated={!!user}
            hasFeaturedPrompt={!!featuredPrompt}
            onNewPrompt={handleNewPrompt}
          />
        )}
      </div>
    </div>
  );
}
