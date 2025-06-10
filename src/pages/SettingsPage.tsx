
import { useCreditStore } from '@/store/creditStore';
import { useThemeStore } from '@/store/themeStore';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { AuthButtons } from '@/components/auth/AuthButtons';
import { 
  Settings as SettingsIcon, 
  Palette, 
  CreditCard, 
  Download, 
  Upload,
  Trash2,
  User,
  Mail,
  Calendar
} from 'lucide-react';

export default function SettingsPage() {
  const { credits, getRemainingCredits } = useCreditStore();
  const { theme, toggleTheme } = useThemeStore();
  const { user, isSignedIn } = useUser();

  const handleExportData = () => {
    // Export all data as JSON
    const data = {
      prompts: localStorage.getItem('promptduck-prompts'),
      credits: localStorage.getItem('promptduck-credits'),
      theme: localStorage.getItem('promptduck-theme'),
      user: user ? {
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName
      } : null,
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
    if (confirm('This will permanently delete all your local data. Your account will remain intact. Are you sure?')) {
      // Clear only local storage, not account data
      localStorage.removeItem('promptduck-prompts');
      localStorage.removeItem('promptduck-credits');
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
          Manage your PromptDuck preferences and account
        </p>
      </div>

      <div className="space-y-6">
        {/* Account Information */}
        {isSignedIn && user ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <img
                  src={user.imageUrl}
                  alt={user.fullName || 'User'}
                  className="w-16 h-16 rounded-full"
                />
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{user.fullName}</h3>
                  <div className="flex items-center text-muted-foreground">
                    <Mail className="w-4 h-4 mr-1" />
                    {user.primaryEmailAddress?.emailAddress}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-1" />
                    Member since {new Date(user.createdAt!).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <AuthButtons />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <User className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Sign in to sync your data</h3>
                <p className="text-muted-foreground mb-6">
                  Create an account to save your prompts, settings, and access your data across devices.
                </p>
                <AuthButtons />
              </div>
            </CardContent>
          </Card>
        )}

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
              Usage & Credits
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
                  {credits.premium ? 'Pro' : 'Free'}
                </Badge>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>Credits reset daily at midnight UTC</p>
              <p>Last reset: {credits.last_reset}</p>
              {!credits.premium && (
                <p className="text-brand-600 font-medium mt-2">
                  Upgrade to Pro for unlimited generations and advanced features
                </p>
              )}
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
                Clear Local Data
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                This will clear your local browser data. Your account and cloud data will remain safe.
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
                <p className="text-sm text-muted-foreground">Version 2.0.0 - Your AI Prompt Engineering Co-Pilot</p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Intelligent prompt engineering powered by cognitive heuristics and advanced AI. 
              Built with React, TypeScript, and integrated with Google Gemini AI.
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
