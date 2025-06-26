
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, Zap } from 'lucide-react';
import { Prompt } from '@/types';

interface FeaturedPromptCardProps {
  prompt: Prompt;
  onPromptClick: () => void;
  onForceRotation: () => void;
}

export function FeaturedPromptCard({ prompt, onPromptClick, onForceRotation }: FeaturedPromptCardProps) {
  return (
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
                onClick={onForceRotation}
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
        onClick={onPromptClick}
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
                {prompt.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {prompt.description || prompt.content.slice(0, 120) + '...'}
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-2 lg:space-y-3 pt-0">
          <div className="flex flex-wrap gap-1">
            {prompt.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="heuristic-tag text-xs px-2 py-1 bg-accent rounded-md">
                {tag}
              </span>
            ))}
            {prompt.tags.length > 4 && (
              <span className="heuristic-tag text-xs px-2 py-1 bg-accent rounded-md">
                +{prompt.tags.length - 4}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Click to use this template
            </span>
            <span>v{prompt.version}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
