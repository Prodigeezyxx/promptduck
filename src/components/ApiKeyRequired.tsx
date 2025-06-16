
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CheckCircle, Sparkles } from 'lucide-react';

export function ApiKeyRequired() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl">AI Engine Ready</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            The AI prompt generation system is fully operational and ready to help you create optimized prompts.
          </p>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-sm text-left space-y-2">
            <h4 className="font-medium text-green-800 dark:text-green-300">System Features:</h4>
            <ul className="list-disc list-inside space-y-1 text-green-700 dark:text-green-400">
              <li>Advanced prompt optimization using cognitive heuristics</li>
              <li>Secure server-side API key management</li>
              <li>Multiple AI models for enhanced generation</li>
              <li>Real-time prompt testing and refinement</li>
            </ul>
          </div>
          
          <Link to="/generator">
            <Button className="bg-gradient-to-r from-brand-500 to-purple-600 hover:from-brand-600 hover:to-purple-700">
              <Sparkles className="w-4 h-4 mr-2" />
              Start Generating Prompts
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
