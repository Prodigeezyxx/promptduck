
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation } from '@/components/layout/Navigation';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { MobileNavigation } from '@/components/layout/MobileNavigation';
import { useUiStore } from '@/store/uiStore';
import { useIsMobile } from '@/hooks/use-mobile';

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { sidebarVisible } = useUiStore();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex w-full">
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
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
