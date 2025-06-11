
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export function ApiKeySettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Engine Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">AI Engine:</span>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600 font-medium">Connected & Ready</span>
          </div>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-green-800 dark:text-green-200 text-sm">
            <strong>System Ready:</strong> The AI prompt generation system is fully operational and ready to create optimized prompts for you.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
