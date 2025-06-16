
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Shield } from 'lucide-react';

export function ApiKeySettings() {
  return (
    <Card className="surface-style border-[rgba(255,255,255,0.05)]">
      <CardHeader>
        <CardTitle className="text-primaryText flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          PromptDuck Engine Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-primaryText">AI Engine:</span>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-success" />
            <span className="text-sm text-success font-medium">Connected & Ready</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-primaryText">Security:</span>
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-success" />
            <span className="text-sm text-success font-medium">Server-Side Protected</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
