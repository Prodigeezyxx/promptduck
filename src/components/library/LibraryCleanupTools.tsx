
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Trash2, RefreshCw } from 'lucide-react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { cleanupDuplicatePrompts, clearMigrationFlags } from '@/utils/dataCleanup';
import { useSupabasePrompts } from '@/hooks/useSupabasePrompts';
import { toast } from '@/hooks/use-toast';

export function LibraryCleanupTools() {
  const { user } = useAuthContext();
  const { refreshPrompts } = useSupabasePrompts();
  const [isCleaningUp, setIsCleaningUp] = useState(false);

  const handleCleanupDuplicates = async () => {
    if (!user) {
      toast({ title: 'Sign in required', description: 'Please sign in to clean up duplicates.' });
      return;
    }

    setIsCleaningUp(true);
    try {
      await cleanupDuplicatePrompts(user.id);
      await refreshPrompts(); // Refresh the data
    } finally {
      setIsCleaningUp(false);
    }
  };

  const handleClearMigrationFlags = () => {
    clearMigrationFlags();
  };

  const handleForceRefresh = async () => {
    await refreshPrompts();
    toast({ title: 'Refreshed!', description: 'Library data has been refreshed.' });
  };

  if (!user) return null;

  return (
    <Card className="mb-6 border-orange-200 bg-orange-50/50 dark:bg-orange-950/20">
      <CardHeader>
        <CardTitle className="flex items-center text-orange-700 dark:text-orange-300">
          <AlertTriangle className="w-5 h-5 mr-2" />
          Library Cleanup Tools
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-orange-600 dark:text-orange-400">
          If you're seeing duplicate prompts or loading issues, use these tools to fix them:
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCleanupDuplicates}
            disabled={isCleaningUp}
            className="border-orange-300 text-orange-700 hover:bg-orange-100"
          >
            {isCleaningUp ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            Remove Duplicates
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearMigrationFlags}
            className="border-orange-300 text-orange-700 hover:bg-orange-100"
          >
            Clear Migration Flags
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleForceRefresh}
            className="border-orange-300 text-orange-700 hover:bg-orange-100"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Force Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
