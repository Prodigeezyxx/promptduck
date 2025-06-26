
import { useEffect, useState } from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';

// MIGRATION SYSTEM DISABLED
// The migration system has been completely disabled to prevent duplicate prompts
// Database-level constraints now handle duplicate prevention

export function useDataMigration() {
  const { user } = useAuthContext();

  // Always return false - no migration needed
  useEffect(() => {
    console.log('Migration system disabled - using database constraints for duplicate prevention');
  }, [user]);

  return { migrationInProgress: false };
}
