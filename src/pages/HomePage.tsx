import { useEffect, useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { dataClient } from '@/data';
import type { HomeLayout, HomeLayoutSection } from '@/data/types';
import { Seo } from '@/components/seo';
import { usePageView } from '@/hooks/use-analytics';
import {
  HeroSection,
  ExperienceSection,
  FeaturedProjectsSection,
  HowIWorkSection,
  MetricsSection,
  AvailabilitySection,
  WritingSection,
  ContactCtaSection,
} from '@/components/home';

export default function HomePage() {
  usePageView('home');
  const { settings, writingData } = useSettings();
  const [homeLayout, setHomeLayout] = useState<HomeLayout | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadHomeLayout() {
      try {
        const layout = await dataClient.getHomeLayout();
        setHomeLayout(layout);
      } catch (error) {
        console.error('Failed to load home layout:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadHomeLayout();
  }, []);

  if (isLoading) {
    return (
      <div className="container-prose py-16 md:py-24">
        <div className="space-y-8">
          <div className="h-32 bg-muted animate-pulse rounded" />
          <div className="h-24 bg-muted animate-pulse rounded" />
          <div className="h-48 bg-muted animate-pulse rounded" />
        </div>
      </div>
    );
  }

  // Get enabled sections, sorted by order
  const enabledSections = (homeLayout?.sections || [])
    .filter(section => section.enabled)
    .sort((a, b) => a.order - b.order);

  const renderSection = (section: HomeLayoutSection) => {
    switch (section.type) {
      case 'hero':
        return <HeroSection key={section.id} section={section} ownerName={settings?.ownerName} />;
      case 'experience':
        return <ExperienceSection key={section.id} section={section} />;
      case 'featuredProjects':
        return <FeaturedProjectsSection key={section.id} section={section} />;
      case 'howIWork':
        return <HowIWorkSection key={section.id} section={section} />;
      case 'metrics':
        return <MetricsSection key={section.id} section={section} />;
      case 'availability':
        return <AvailabilitySection key={section.id} section={section} />;
      case 'writing':
        return <WritingSection key={section.id} section={section} writingData={writingData} />;
      case 'contactCta':
        return <ContactCtaSection key={section.id} section={section} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Seo />
      <div className="container-prose py-16 md:py-24">
        {enabledSections.map(renderSection)}
      </div>
    </>
  );
}
