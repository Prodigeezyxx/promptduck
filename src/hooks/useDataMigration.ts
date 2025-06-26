
import { useEffect, useState } from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';

// MIGRATION DISABLED - This was causing duplicate prompts
// The migration system has been disabled to prevent continuous duplicates
// Use manual cleanup tools in settings if needed

export function useDataMigration() {
  const { user } = useAuthContext();
  const [migrationInProgress, setMigrationInProgress] = useState(false);

  // Disable all automatic migration
  useEffect(() => {
    // No automatic migration - this was causing the duplicate issue
    console.log('Auto-migration disabled to prevent duplicates');
  }, [user]);

  return { migrationInProgress: false };
}
