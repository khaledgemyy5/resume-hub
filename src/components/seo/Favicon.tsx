import { useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';

export function Favicon() {
  const { settings } = useSettings();
  
  useEffect(() => {
    if (!settings) return;
    
    // Update favicon
    if (settings.faviconUrl) {
      updateLink('icon', settings.faviconUrl);
    }
    
    // Update Apple touch icon
    if (settings.appleTouchIconUrl) {
      updateLink('apple-touch-icon', settings.appleTouchIconUrl);
    }
  }, [settings?.faviconUrl, settings?.appleTouchIconUrl]);

  return null;
}

function updateLink(rel: string, href: string) {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }
  
  element.href = href;
}
