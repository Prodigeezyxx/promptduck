
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
    // Store the user's current theme preference
    const userTheme = theme;
    
    // Force dark mode for landing page
    setTheme('dark');
    
    // Cleanup function to restore user's theme when leaving landing page
    return () => {
      setTheme(userTheme);
    };
  }, []);

  return (
    <div className="min-h-screen">
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
