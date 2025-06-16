
import { useState } from 'react';
import { Settings as SettingsIcon, User, Database, Trash2, Download, Loader2, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { ApiKeySettings } from '@/components/settings/ApiKeySettings';
import { usePromptStore } from '@/store/promptStore';
import { useGeneratorStore } from '@/store/generatorStore';
import { useCreditStore } from '@/store/creditStore';
import { useUiStore } from '@/store/uiStore';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { toast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { user } = useAuthContext();
  const { prompts, clearHistory: clearPrompts } = usePromptStore();
  const { history, clearHistory: clearGeneratorHistory } = useGeneratorStore();
  const { credits } = useCreditStore();
  const { sidebarVisible, toggleSidebar } = useUiStore();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const exportData = {
        prompts,
        generatorHistory: history,
        credits,
        exportedAt: new Date().toISOString(),
        version: '1.0'
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `promptduck-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Export completed',
        description: 'Your data has been exported successfully.'
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'There was an error exporting your data.'
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear all your data? This action cannot be undone.')) {
      clearPrompts();
      clearGeneratorHistory();
      toast({
        title: 'Data cleared',
        description: 'All your local data has been cleared.'
      });
    }
  };

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold flex items-center">
            <SettingsIcon className="w-6 h-6 lg:w-7 lg:h-7 mr-3 text-brand-500" />
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your account, preferences, and application settings
          </p>
        </div>
      </div>

      {/* User Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <img 
                  src={user.user_metadata?.avatar_url} 
                  alt={user.user_metadata?.full_name || 'User'} 
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-medium">{user.user_metadata?.full_name || 'User'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">
                  Joined {new Date(user.created_at).toLocaleDateString()}
                </Badge>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  Verified
                </Badge>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">Please sign in to view account information</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* UI Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Interface Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="text-sm font-medium">Show Navigation Sidebar</label>
              <p className="text-xs text-muted-foreground">
                Toggle the visibility of the main navigation sidebar
              </p>
            </div>
            <Switch
              checked={sidebarVisible}
              onCheckedChange={toggleSidebar}
            />
          </div>
        </CardContent>
      </Card>

      {/* AI Engine Status */}
      <ApiKeySettings />

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Usage Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-brand-500">{prompts.length}</div>
              <div className="text-sm text-muted-foreground">Saved Prompts</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-500">{history.length}</div>
              <div className="text-sm text-muted-foreground">Generated Prompts</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-green-500">
                {credits.daily_limit - credits.used_today}
              </div>
              <div className="text-sm text-muted-foreground">Credits Remaining</div>
            </div>
          </div>

          <Separator />

          {/* Data Actions */}
          <div className="space-y-4">
            <h4 className="font-medium">Data Export & Management</h4>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleExportData}
                disabled={isExporting}
                variant="outline"
                className="flex-1"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleClearAllData}
                variant="destructive"
                className="flex-1"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Data
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Export includes your saved prompts, generation history, and settings. 
              Data is stored locally in your browser and synced with your account when signed in.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* App Information */}
      <Card>
        <CardHeader>
          <CardTitle>About PromptDuck</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Version</span>
            <Badge variant="outline">1.0.0</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Last Updated</span>
            <span className="text-sm">{new Date().toLocaleDateString()}</span>
          </div>
          <Separator />
          <p className="text-xs text-muted-foreground">
            PromptDuck helps you create, optimize, and manage prompts with advanced heuristics 
            and persona-based generation. Your data is secured and synced across devices when signed in.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
