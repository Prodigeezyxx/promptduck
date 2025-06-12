
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useThemeStore } from "@/store/themeStore";
import { AuthProvider, useAuthContext } from "@/components/auth/AuthProvider";
import { useEffect } from "react";
import { DuckIcon } from "@/components/icons/DuckIcon";

// Pages
import LandingPage from "./pages/LandingPage";
import AppLayout from "./pages/AppLayout";
import PromptLibraryPage from "./pages/PromptLibraryPage";
import AIGeneratorPage from "./pages/AIGeneratorPage";
import PlaygroundPage from "./pages/PlaygroundPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const { theme } = useThemeStore();
  const { isSignedIn, isLoaded } = useAuthContext();
  const location = useLocation();

  useEffect(() => {
    // Apply theme on app initialization and route changes
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, location.pathname]);

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
      
      {/* Protected App Routes */}
      <Route path="/app" element={
        isSignedIn ? <AppLayout /> : <Navigate to="/" replace />
      }>
        <Route index element={<Navigate to="/app/library" replace />} />
        <Route path="library" element={<PromptLibraryPage />} />
        <Route path="generator" element={<AIGeneratorPage />} />
        <Route path="playground" element={<PlaygroundPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Redirects for convenience */}
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
