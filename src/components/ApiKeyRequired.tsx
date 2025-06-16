
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Shield } from 'lucide-react';

export function ApiKeyRequired() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl">AI Service Ready</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            The AI prompt generator is ready to use! Your OpenAI API access is securely managed 
            on our servers, so you can start generating optimized prompts right away.
          </p>
          
          <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg text-sm text-left space-y-2">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-800 dark:text-green-300">Secure & Ready</h4>
                <p className="text-green-700 dark:text-green-400 mt-1">
                  AI processing is handled securely on our servers. No API keys needed on your device.
                </p>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground">
            All AI features are now available including the prompt generator and playground chat.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
