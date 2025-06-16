
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Key, Shield } from 'lucide-react';

export function ApiKeySettings() {
  return (
    <Card className="surface-style border-[rgba(255,255,255,0.05)]">
      <CardHeader>
        <CardTitle className="text-primaryText flex items-center">
          <Key className="w-5 h-5 mr-2" />
          OpenAI API Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-primaryText">Status:</span>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-success" />
            <span className="text-sm text-success font-medium">Connected</span>
          </div>
        </div>

        <div className="bg-success/10 p-4 rounded-lg border border-success/20">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-success mt-0.5" />
            <div>
              <p className="text-success text-sm font-medium mb-2">
                Secure Server-Side Configuration
              </p>
              <p className="text-success text-xs leading-relaxed">
                Your OpenAI API access is managed securely on our servers. No API keys are exposed in your browser or stored locally. All AI requests are processed through our secure backend infrastructure.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-blue-800 dark:text-blue-300 text-xs">
            <strong>Privacy & Security:</strong> All AI processing happens on secure servers with enterprise-grade encryption. Your prompts and responses are processed securely and are not stored permanently.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
