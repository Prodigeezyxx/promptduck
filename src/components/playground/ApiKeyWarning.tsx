
import { AlertCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface ApiKeyWarningProps {
  isValidKey: boolean;
}

export function ApiKeyWarning({ isValidKey }: ApiKeyWarningProps) {
  if (isValidKey) {
    return null;
  }

  return (
    <Card className="border-destructive/20 bg-destructive/5">
      <CardContent className="pt-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
          <div className="flex-1 space-y-2">
            <h3 className="font-medium text-destructive">API Key Required</h3>
            <p className="text-sm text-muted-foreground">
              You need to configure your OpenAI API key to use the playground features.
            </p>
            <Link to="/settings">
              <Button size="sm" variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Configure API Key
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
