import { useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';

interface SeoProps {
  title?: string;
  description?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export function Seo({ title, description, ogImage, noIndex }: SeoProps) {
  const { settings } = useSettings();
  
  const siteDefaults = settings?.seoDefaults;
  const siteName = settings?.siteName ?? 'Portfolio';
  
  const pageTitle = title 
    ? `${title} | ${siteName}`
    : siteDefaults?.title ?? siteName;
  
  const pageDescription = description ?? siteDefaults?.description ?? '';
  const pageOgImage = ogImage ?? siteDefaults?.ogImage;

  useEffect(() => {
    // Update document title
    document.title = pageTitle;
    
    // Update meta tags
    updateMetaTag('description', pageDescription);
    updateMetaTag('og:title', pageTitle, 'property');
    updateMetaTag('og:description', pageDescription, 'property');
    updateMetaTag('og:type', 'website', 'property');
    
    if (pageOgImage) {
      updateMetaTag('og:image', pageOgImage, 'property');
    }
    
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', pageTitle);
    updateMetaTag('twitter:description', pageDescription);
    
    if (pageOgImage) {
      updateMetaTag('twitter:image', pageOgImage);
    }
    
    if (noIndex) {
      updateMetaTag('robots', 'noindex,nofollow');
    } else {
      removeMetaTag('robots');
    }
    
    return () => {
      // Cleanup is handled by next Seo component mount
    };
  }, [pageTitle, pageDescription, pageOgImage, noIndex]);

  return null;
}

function updateMetaTag(name: string, content: string, attr: 'name' | 'property' = 'name') {
  const selector = attr === 'property' 
    ? `meta[property="${name}"]` 
    : `meta[name="${name}"]`;
  
  let element = document.querySelector(selector) as HTMLMetaElement | null;
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, name);
    document.head.appendChild(element);
  }
  
  element.content = content;
}

function removeMetaTag(name: string) {
  const element = document.querySelector(`meta[name="${name}"]`);
  if (element) {
    element.remove();
  }
}
