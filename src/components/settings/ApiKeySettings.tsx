
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export function ApiKeySettings() {
  return (
    <Card className="surface-style border-[rgba(255,255,255,0.05)]">
      <CardHeader>
        <CardTitle className="text-primaryText">AI Engine Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-primaryText">AI Engine:</span>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-success" />
            <span className="text-sm text-success font-medium">Connected & Ready</span>
          </div>
        </div>
        
        <div className="bg-success/10 p-4 rounded-lg border border-success/20">
          <p className="text-success text-sm">
            <strong>System Ready:</strong> The AI prompt generation system is fully operational and ready to create optimized prompts for you.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
