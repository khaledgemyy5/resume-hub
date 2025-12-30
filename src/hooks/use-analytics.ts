import { useCallback, useEffect, useRef } from 'react';
import { dataClient } from '@/data';
import type { AnalyticsEventType } from '@/data/types';

interface TrackOptions {
  path?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Hook for tracking analytics events.
 * Uses sendBeacon when available for reliable event sending.
 */
export function useAnalytics() {
  const track = useCallback((type: AnalyticsEventType, options: TrackOptions = {}) => {
    const path = options.path || window.location.pathname;
    const referrer = document.referrer || undefined;
    
    // Try sendBeacon first for better reliability (especially on page unload)
    if (navigator.sendBeacon && import.meta.env.VITE_API_BASE_URL) {
      const payload = JSON.stringify({
        type,
        path,
        referrer,
        metadata: options.metadata,
      });
      const sent = navigator.sendBeacon(
        `${import.meta.env.VITE_API_BASE_URL}/events`,
        new Blob([payload], { type: 'application/json' })
      );
      if (sent) return;
    }
    
    // Fallback to dataClient (works for mock mode and when sendBeacon fails)
    dataClient.trackEvent({
      type,
      path,
      referrer,
      metadata: options.metadata,
    }).catch(console.error);
  }, []);

  return { track };
}

/**
 * Hook for tracking page views automatically on mount.
 */
export function usePageView(pageName?: string) {
  const { track } = useAnalytics();
  const tracked = useRef(false);
  
  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    
    track('page_view', { metadata: pageName ? { page: pageName } : undefined });
  }, [track, pageName]);
}
