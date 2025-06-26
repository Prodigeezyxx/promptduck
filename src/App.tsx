
import { Toaster } from "@/components/ui/toaster";
import { Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useThemeStore } from "@/store/themeStore";
import { AuthProvider, useAuthContext } from "@/components/auth/AuthProvider";
import { useEffect } from "react";
import { DuckIcon } from "@/components/icons/DuckIcon";
import { analytics } from "@/services/analytics/posthog";
import { useAnalytics } from "@/hooks/useAnalytics";

// Pages
import LandingPage from "./pages/LandingPage";
import AppLayout from "./pages/AppLayout";
import PromptLibraryPage from "./pages/PromptLibraryPage";
import AIGeneratorPage from "./pages/AIGeneratorPage";
import PlaygroundPage from "./pages/PlaygroundPage";
import SettingsPage from "./pages/SettingsPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const { theme } = useThemeStore();
  const { isSignedIn, isLoaded, user } = useAuthContext();
  const { trackPageView, identifyUser } = useAnalytics();
  const location = useLocation();

  useEffect(() => {
    // Initialize PostHog
    analytics.init();
  }, []);

  useEffect(() => {
    // Apply theme on app initialization and route changes
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Track page views
    trackPageView(location.pathname);
  }, [theme, location.pathname, trackPageView]);

  useEffect(() => {
    // Identify user when signed in
    if (isSignedIn && user?.id) {
      identifyUser(user.id, {
        email: user.email,
        plan: 'free', // Update based on your user plan logic
      });
    }
  }, [isSignedIn, user, identifyUser]);

  // Show loading while auth is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-pulse">
            <DuckIcon size={48} />
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
          <p className="text-sm text-muted-foreground">Loading PromptDuck...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Legal Pages */}
      <Route path="/terms" element={<TermsOfServicePage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      
      {/* App Routes */}
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Navigate to="/app/library" replace />} />
        <Route path="library" element={<PromptLibraryPage />} />
        <Route path="generator" element={<AIGeneratorPage />} />
        <Route path="playground" element={<PlaygroundPage />} />
        <Route path="settings" element={
          isSignedIn ? <SettingsPage /> : <Navigate to="/app/library" replace />
        } />
      </Route>

      {/* Direct redirects for convenience */}
      <Route path="/library" element={<Navigate to="/app/library" replace />} />
      <Route path="/generator" element={<Navigate to="/app/generator" replace />} />
      <Route path="/playground" element={<Navigate to="/app/playground" replace />} />
      <Route path="/settings" element={<Navigate to="/app/settings" replace />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <HashRouter>
            <AppContent />
          </HashRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
