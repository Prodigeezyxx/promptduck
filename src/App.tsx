
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { useThemeStore } from "@/store/themeStore";
import { useEffect } from "react";

// Pages
import LandingPage from "./pages/LandingPage";
import AppLayout from "./pages/AppLayout";
import PromptLibraryPage from "./pages/PromptLibraryPage";
import AIGeneratorPage from "./pages/AIGeneratorPage";
import PlaygroundPage from "./pages/PlaygroundPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const { theme } = useThemeStore();

  useEffect(() => {
    // Apply theme on app initialization
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* App Routes */}
            <Route path="/app" element={<AppLayout />}>
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
        </HashRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
