
import { useCreditStore } from '@/store/creditStore';
import { useThemeStore } from '@/store/themeStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Settings as SettingsIcon, 
  Palette, 
  CreditCard, 
  Download, 
  Upload,
  Trash2
} from 'lucide-react';

export default function SettingsPage() {
  const { credits, getRemainingCredits } = useCreditStore();
  const { theme, toggleTheme } = useThemeStore();

  const handleExportData = () => {
    // Export all data as JSON
    const data = {
      prompts: localStorage.getItem('promptduck-prompts'),
      credits: localStorage.getItem('promptduck-credits'),
      theme: localStorage.getItem('promptduck-theme'),
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `promptduck-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (confirm('This will permanently delete all your data. Are you sure?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center">
          <SettingsIcon className="w-8 h-8 mr-3 text-brand-500" />
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your PromptDuck preferences and configuration
        </p>
      </div>

      <div className="space-y-6">
        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Dark Mode</h4>
                <p className="text-sm text-muted-foreground">
                  Toggle between light and dark themes
                </p>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
            </div>
          </CardContent>
        </Card>

        {/* Credit Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Credits & Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Daily Limit:</span>
                <p className="text-2xl font-bold">{credits.daily_limit}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Remaining Today:</span>
                <p className="text-2xl font-bold text-brand-600">{getRemainingCredits()}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Used Today:</span>
                <p className="text-2xl font-bold">{credits.used_today}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Account Type:</span>
                <Badge className="mt-1">
                  {credits.premium ? 'Premium' : 'Free'}
                </Badge>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>Credits reset daily at midnight UTC</p>
              <p>Last reset: {credits.last_reset}</p>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" onClick={handleExportData}>
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              
              <Button variant="outline" disabled>
                <Upload className="w-4 h-4 mr-2" />
                Import Data
              </Button>
            </div>
            
            <div className="border-t pt-4">
              <Button 
                variant="destructive" 
                onClick={handleClearData}
                className="w-full md:w-auto"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Data
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                This will permanently delete all your prompts, settings, and data.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle>About PromptDuck</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🦆</span>
              </div>
              <div>
                <h3 className="font-bold text-lg gradient-text">PromptDuck</h3>
                <p className="text-sm text-muted-foreground">Version 1.0.0</p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Cognitive prompt engineering for the modern creator. Built with React, TypeScript, 
              and powered by Google Gemini AI.
            </p>
            
            <div className="flex space-x-4 text-sm">
              <a href="#" className="text-primary hover:underline">Documentation</a>
              <a href="#" className="text-primary hover:underline">Support</a>
              <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              <a href="#" className="text-primary hover:underline">Terms of Service</a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
