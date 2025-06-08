
import { useState } from 'react';
import { useApiKeyStore } from '@/store/apiKeyStore';
import { geminiService } from '@/services/geminiService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { KeyRound, Eye, EyeOff, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export function ApiKeySettings() {
  const { apiKey, setApiKey, clearApiKey, updateStatus } = useApiKeyStore();
  const [newKey, setNewKey] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isTestingKey, setIsTestingKey] = useState(false);

  const handleSaveKey = async () => {
    if (!newKey.trim()) {
      toast({ title: 'Error', description: 'Please enter an API key' });
      return;
    }

    setIsTestingKey(true);
    
    try {
      const isValid = await geminiService.testConnection(newKey);
      
      if (isValid) {
        setApiKey(newKey);
        updateStatus('active');
        setNewKey('');
        toast({ title: 'Success', description: 'API key saved and verified!' });
      } else {
        toast({ title: 'Invalid key', description: 'API key test failed. Please check your key.' });
      }
    } catch (error) {
      toast({ title: 'Test failed', description: 'Unable to verify API key. Please try again.' });
    } finally {
      setIsTestingKey(false);
    }
  };

  const handleRemoveKey = () => {
    clearApiKey();
    toast({ title: 'Removed', description: 'API key has been removed' });
  };

  const maskKey = (key: string) => {
    if (key.length <= 8) return key;
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <KeyRound className="w-5 h-5 mr-2" />
          Google Gemini API Key
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Key Status */}
        {apiKey && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current API Key:</span>
              <Badge className={`${
                apiKey.status === 'active' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
              }`}>
                {apiKey.status === 'active' ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3 mr-1" />
                    Invalid
                  </>
                )}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <code className="text-sm bg-muted px-2 py-1 rounded flex-1">
                {isVisible ? apiKey.gemini : maskKey(apiKey.gemini)}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsVisible(!isVisible)}
              >
                {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveKey}
                className="text-destructive hover:text-destructive"
              >
                Remove
              </Button>
            </div>
            
            {apiKey.last_used && (
              <p className="text-xs text-muted-foreground">
                Last used: {new Date(apiKey.last_used).toLocaleString()}
              </p>
            )}
          </div>
        )}

        {/* Add/Update Key */}
        <div className="space-y-3">
          <h4 className="font-medium">
            {apiKey ? 'Update API Key' : 'Add API Key'}
          </h4>
          
          <div className="flex space-x-2">
            <Input
              type={isVisible ? 'text' : 'password'}
              placeholder="Enter your Gemini API key..."
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="font-mono"
            />
            <Button
              onClick={handleSaveKey}
              disabled={!newKey.trim() || isTestingKey}
            >
              {isTestingKey ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                'Save & Test'
              )}
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-muted/50 p-4 rounded-lg text-sm space-y-2">
          <h4 className="font-medium">How to get a Gemini API key:</h4>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
            <li>
              Visit{' '}
              <a 
                href="https://makersuite.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google AI Studio
              </a>
            </li>
            <li>Sign in with your Google account</li>
            <li>Click "Create API Key" in a new project</li>
            <li>Copy the generated key and paste it above</li>
          </ol>
          
          <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
            <p className="text-yellow-800 dark:text-yellow-200 text-xs">
              <strong>Security:</strong> Your API key is stored locally in your browser and never sent to PromptDuck servers. 
              It's only used to communicate directly with Google's AI services.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
