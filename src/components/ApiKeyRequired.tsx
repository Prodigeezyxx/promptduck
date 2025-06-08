
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { KeyRound, Settings } from 'lucide-react';

export function ApiKeyRequired() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <KeyRound className="w-8 h-8 text-brand-600 dark:text-brand-400" />
          </div>
          <CardTitle className="text-2xl">API Key Required</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            To use the AI prompt generator, you need to configure your Google Gemini API key. 
            This allows PromptDuck to generate optimized prompts using advanced AI.
          </p>
          
          <div className="bg-muted/50 p-4 rounded-lg text-sm text-left space-y-2">
            <h4 className="font-medium">How to get a Gemini API key:</h4>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Visit <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google AI Studio</a></li>
              <li>Sign in with your Google account</li>
              <li>Click "Create API Key"</li>
              <li>Copy the generated key</li>
              <li>Paste it in PromptDuck settings</li>
            </ol>
          </div>
          
          <Link to="/settings">
            <Button className="bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-600 hover:to-purple-700">
              <Settings className="w-4 h-4 mr-2" />
              Configure API Key
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
