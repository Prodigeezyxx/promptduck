
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Info } from 'lucide-react';
import { Prompt } from '@/types';

interface TemplateReferenceProps {
  template: Prompt;
  onClose: () => void;
  onUseAsStartingPoint: () => void;
}

export function TemplateReference({ template, onClose, onUseAsStartingPoint }: TemplateReferenceProps) {
  return (
    <Card className="border-brand-200 bg-brand-50/50 dark:bg-brand-950/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-brand-600 mt-0.5 flex-shrink-0" />
            <div>
              <CardTitle className="text-lg text-brand-700 dark:text-brand-300">
                Template Reference: {template.title}
              </CardTitle>
              <p className="text-sm text-brand-600 dark:text-brand-400 mt-1">
                {template.description}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-brand-600 hover:text-brand-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Template Content Preview */}
        <div>
          <h4 className="font-medium text-sm text-brand-700 dark:text-brand-300 mb-2">
            Template Structure:
          </h4>
          <div className="bg-white dark:bg-gray-900 rounded-md p-3 border text-sm">
            {template.content}
          </div>
        </div>

        {/* Variables */}
        {template.variables && template.variables.length > 0 && (
          <div>
            <h4 className="font-medium text-sm text-brand-700 dark:text-brand-300 mb-2">
              Required Variables:
            </h4>
            <div className="space-y-2">
              {template.variables.map((variable) => (
                <div key={variable.name} className="bg-white dark:bg-gray-900 rounded-md p-2 border">
                  <div className="flex items-center gap-2 mb-1">
                    <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">
                      {variable.name}
                    </code>
                    <Badge variant="secondary" className="text-xs">
                      {variable.type}
                    </Badge>
                    {variable.required && (
                      <Badge variant="destructive" className="text-xs">
                        Required
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{variable.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags and Metadata */}
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline">{template.difficulty}</Badge>
          <Badge variant="outline">{template.estimatedTime}</Badge>
          {template.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Action Button */}
        <Button
          onClick={onUseAsStartingPoint}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white"
        >
          Use This Template as Starting Point
        </Button>
      </CardContent>
    </Card>
  );
}
