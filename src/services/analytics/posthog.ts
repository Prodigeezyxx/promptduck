
import posthog from 'posthog-js';

class PostHogService {
  private initialized = false;

  init() {
    if (this.initialized) return;
    
    const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
    const posthogHost = import.meta.env.VITE_POSTHOG_HOST;
    
    if (!posthogKey) {
      console.warn('PostHog key not found. Analytics will be disabled.');
      return;
    }

    posthog.init(posthogKey, {
      api_host: posthogHost || 'https://eu.i.posthog.com',
      // Disable in development mode
      loaded: (posthog) => {
        if (import.meta.env.DEV) posthog.debug();
      },
      capture_pageview: false, // We'll manually capture pageviews
      capture_pageleave: true,
      // Configure person profiles to match the provided script
      person_profiles: 'identified_only',
      // Session recording configuration
      session_recording: {
        maskAllInputs: false,
        maskInputOptions: {
          password: true,
        },
      },
    });

    this.initialized = true;
  }

  // Track custom events
  track(event: string, properties?: Record<string, any>) {
    if (!this.initialized) return;
    posthog.capture(event, properties);
  }

  // Track page views
  trackPageView(path?: string) {
    if (!this.initialized) return;
    posthog.capture('$pageview', {
      $current_url: path || window.location.href,
    });
  }

  // Identify users
  identify(userId: string, properties?: Record<string, any>) {
    if (!this.initialized) return;
    posthog.identify(userId, properties);
  }

  // Set user properties
  setUserProperties(properties: Record<string, any>) {
    if (!this.initialized) return;
    posthog.people.set(properties);
  }

  // Reset user (for logout)
  reset() {
    if (!this.initialized) return;
    posthog.reset();
  }

  // Group analytics (for team/organization tracking)
  group(groupType: string, groupKey: string, properties?: Record<string, any>) {
    if (!this.initialized) return;
    posthog.group(groupType, groupKey, properties);
  }
}

export const analytics = new PostHogService();
