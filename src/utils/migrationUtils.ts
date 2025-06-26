
const MIGRATION_KEY = 'promptduck-migration-completed';
const MIGRATION_VERSION = '2.0';

export const clearMigrationState = (userId?: string) => {
  if (userId) {
    // Clear for specific user
    localStorage.removeItem(`${MIGRATION_KEY}-${userId}-${MIGRATION_VERSION}`);
  } else {
    // Clear all migration states (useful for debugging)
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(MIGRATION_KEY)) {
        localStorage.removeItem(key);
      }
    });
  }
};

export const hasMigrationCompleted = (userId: string) => {
  return localStorage.getItem(`${MIGRATION_KEY}-${userId}-${MIGRATION_VERSION}`) === 'true';
};

export const forceMigration = (userId: string) => {
  clearMigrationState(userId);
  window.location.reload();
};
