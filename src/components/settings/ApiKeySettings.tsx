
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CheckCircle, Key, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useApiKeyStore } from '@/store/apiKeyStore';
import { toast } from '@/hooks/use-toast';

export function ApiKeySettings() {
  const { apiKey, setApiKey, clearApiKey, isValidKey } = useApiKeyStore();
  const [inputKey, setInputKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveKey = async () => {
    if (!inputKey.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a valid API key',
        variant: 'destructive'
      });
      return;
    }

    if (!inputKey.startsWith('sk-')) {
      toast({
        title: 'Error',
        description: 'OpenAI API keys should start with "sk-"',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      // Test the API key by making a simple request
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${inputKey}`,
        },
      });

      if (response.ok) {
        setApiKey(inputKey);
        setInputKey('');
        toast({
          title: 'Success',
          description: 'API key saved and verified successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Invalid API key. Please check and try again.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Unable to verify API key. Please check your connection.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearKey = () => {
    clearApiKey();
    setInputKey('');
    toast({
      title: 'API Key Removed',
      description: 'Your API key has been cleared from storage',
    });
  };

  const maskedKey = apiKey?.openai 
    ? `${apiKey.openai.substring(0, 7)}...${apiKey.openai.substring(apiKey.openai.length - 4)}`
    : '';

  return (
    <Card className="surface-style border-[rgba(255,255,255,0.05)]">
      <CardHeader>
        <CardTitle className="text-primaryText flex items-center">
          <Key className="w-5 h-5 mr-2" />
          OpenAI API Key
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-primaryText">Status:</span>
          <div className="flex items-center space-x-2">
            {isValidKey() ? (
              <>
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="text-sm text-success font-medium">Connected</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-destructive" />
                <span className="text-sm text-destructive font-medium">Not configured</span>
              </>
            )}
          </div>
        </div>

        {isValidKey() ? (
          <div className="space-y-4">
            <div className="bg-success/10 p-4 rounded-lg border border-success/20">
              <p className="text-success text-sm mb-2">
                <strong>API Key Active:</strong> {maskedKey}
              </p>
              <p className="text-success text-xs">
                Your API key is securely stored locally and ready for use.
              </p>
            </div>
            <Button 
              onClick={handleClearKey}
              variant="outline"
              className="w-full"
            >
              Remove API Key
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg text-sm space-y-2">
              <h4 className="font-medium">How to get an OpenAI API key:</h4>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Visit <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenAI Platform</a></li>
                <li>Sign in with your OpenAI account</li>
                <li>Click "Create new secret key"</li>
                <li>Copy the generated key</li>
                <li>Paste it below</li>
              </ol>
            </div>

            <div className="space-y-2">
              <Label htmlFor="api-key">OpenAI API Key</Label>
              <div className="relative">
                <Input
                  id="api-key"
                  type={showKey ? "text" : "password"}
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="sk-..."
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button 
              onClick={handleSaveKey}
              disabled={isLoading || !inputKey.trim()}
              className="w-full"
            >
              {isLoading ? 'Verifying...' : 'Save & Verify API Key'}
            </Button>

            <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-blue-800 dark:text-blue-300 text-xs">
                <strong>Privacy:</strong> Your API key is stored locally in your browser and never sent to our servers. It's only used to communicate directly with OpenAI's API.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
