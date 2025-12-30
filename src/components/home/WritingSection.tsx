import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import type { HomeLayoutSection, WritingData } from '@/data/types';

interface WritingSectionProps {
  section: HomeLayoutSection;
  writingData: WritingData | null;
}

export function WritingSection({ section, writingData }: WritingSectionProps) {
  // Get all featured + enabled writing items, flattened
  const allItems = writingData?.categories
    .filter(cat => cat.enabled)
    .flatMap(cat => cat.items.filter(item => item.enabled && item.featured)) || [];

  // Take first 4 featured items
  const featuredItems = allItems.slice(0, 4);

  if (featuredItems.length === 0) return null;

  return (
    <section className="mb-16 md:mb-24">
      <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-6">
        {section.titleOverride || 'Selected Writing'}
      </h2>
      <div className="space-y-3">
        {featuredItems.map(item => (
          <a 
            key={item.id}
            href={item.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between py-3 border-b border-border hover:border-foreground transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium">{item.title}</span>
                {item.platform && (
                  <span className="text-xs text-muted-foreground">({item.platform})</span>
                )}
              </div>
            </div>
            <ExternalLink 
              size={14} 
              className="shrink-0 text-muted-foreground group-hover:text-foreground transition-colors ml-3" 
            />
          </a>
        ))}
      </div>
      <Link 
        to="/writing"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mt-4"
      >
        <span>View all writing</span>
        <ArrowRight size={14} />
      </Link>
    </section>
  );
}
