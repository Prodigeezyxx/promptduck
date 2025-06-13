
import { useEffect } from 'react';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { useThemeStore } from '@/store/themeStore';

export default function LandingPage() {
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    // Clear any inactive guest sessions when landing on the home page
    const guestSession = localStorage.getItem('promptduck_guest_session');
    if (guestSession) {
      try {
        const guest = JSON.parse(guestSession);
        // If user is on landing page and has a non-active guest session, clear it
        if (!guest.isActive || !guest.isPersistent) {
          localStorage.removeItem('promptduck_guest_session');
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'promptduck_guest_session',
            newValue: null
          }));
        }
      } catch (error) {
        localStorage.removeItem('promptduck_guest_session');
      }
    }

    // Store the user's current theme preference
    const userTheme = theme;
    
    // Force dark mode for landing page (matches new design system)
    setTheme('dark');
    
    // Cleanup function to restore user's theme when leaving landing page
    return () => {
      setTheme(userTheme);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-primaryText">
      <LandingHeader />
      <main>
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
      </main>
      <LandingFooter />
    </div>
  );
}
