
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation } from '@/components/layout/Navigation';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { MobileNavigation } from '@/components/layout/MobileNavigation';
import { useUiStore } from '@/store/uiStore';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { useDataMigration } from '@/hooks/useDataMigration';
import { useRealtimeSync } from '@/hooks/useRealtimeSync';
import { useBackgroundPreloader } from '@/hooks/useBackgroundPreloader';

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { sidebarVisible } = useUiStore();
  const isMobile = useIsMobile();
  const { user } = useAuthContext();

  // Initialize data migration (this will handle all syncing)
  useDataMigration();
  
  // Start background preloading of prompts and generations
  useBackgroundPreloader();
  
  // Only setup realtime sync for authenticated users after migration
  if (user) {
    useRealtimeSync();
  }

  return (
    <div className="min-h-screen flex w-full bg-background mobile-safe-area">
      {/* Desktop Navigation - conditionally rendered */}
      {(!isMobile && sidebarVisible) && <Navigation />}
      
      {/* Mobile Navigation */}
      <MobileNavigation 
        open={mobileMenuOpen} 
        onOpenChange={setMobileMenuOpen} 
      />
      
      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
        !isMobile && sidebarVisible ? 'lg:ml-64' : 'lg:ml-0'
      }`}>
        {/* Mobile Header */}
        <MobileHeader onMenuToggle={() => setMobileMenuOpen(true)} />
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto mobile-scroll">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
