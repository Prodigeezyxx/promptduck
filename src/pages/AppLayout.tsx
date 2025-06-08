
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation } from '@/components/layout/Navigation';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { MobileNavigation } from '@/components/layout/MobileNavigation';

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex w-full">
      {/* Desktop Navigation */}
      <Navigation />
      
      {/* Mobile Navigation */}
      <MobileNavigation 
        open={mobileMenuOpen} 
        onOpenChange={setMobileMenuOpen} 
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
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
