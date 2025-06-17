
import { useCallback } from 'react';
import { analytics } from '@/services/analytics/posthog';
import { useAuthContext } from '@/components/auth/AuthProvider';

export function useAnalytics() {
  const { user } = useAuthContext();

  const track = useCallback((event: string, properties?: Record<string, any>) => {
    analytics.track(event, {
      ...properties,
      user_id: user?.id,
      timestamp: new Date().toISOString(),
    });
  }, [user?.id]);

  const trackPageView = useCallback((path?: string) => {
    analytics.trackPageView(path);
  }, []);

  const identifyUser = useCallback((userId: string, properties?: Record<string, any>) => {
    analytics.identify(userId, {
      ...properties,
      email: user?.email,
    });
  }, [user?.email]);

  const setUserProperties = useCallback((properties: Record<string, any>) => {
    analytics.setUserProperties(properties);
  }, []);

  return {
    track,
    trackPageView,
    identifyUser,
    setUserProperties,
    reset: analytics.reset,
  };
}
