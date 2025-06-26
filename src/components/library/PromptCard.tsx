
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Trash2, Edit, MoreHorizontal, Download } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Prompt } from '@/types';

interface PromptCardProps {
  prompt: Prompt;
  onCardClick: (prompt: Prompt) => void;
  onEdit: (prompt: Prompt) => void;
  onDuplicate: (prompt: Prompt) => void;
  onDownload: (prompt: Prompt) => void;
  onDelete: (prompt: Prompt) => void;
}

export function PromptCard({ 
  prompt, 
  onCardClick, 
  onEdit, 
  onDuplicate, 
  onDownload, 
  onDelete 
}: PromptCardProps) {
  return (
    <Card 
      className="prompt-card cursor-pointer group hover:shadow-lg transition-all duration-200 border border-border/50"
      onClick={() => onCardClick(prompt)}
    >
      <CardHeader className="pb-2 lg:pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm lg:text-base font-semibold line-clamp-2 mb-1 lg:mb-2">
              {prompt.title}
            </CardTitle>
            {prompt.description && (
              <div className="mb-2">
                <p className="text-xs font-medium text-brand-600 dark:text-brand-400">Original Intent:</p>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {prompt.description}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs font-medium text-purple-600 dark:text-purple-400">Refined Prompt:</p>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {prompt.content.slice(0, 100) + (prompt.content.length > 100 ? '...' : '')}
              </p>
            </div>
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
                onEdit(prompt);
              }}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onDuplicate(prompt);
              }}>
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onDownload(prompt);
              }}>
                <Download className="w-4 h-4 mr-2" />
                Download JSON
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(prompt);
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
  );
}
