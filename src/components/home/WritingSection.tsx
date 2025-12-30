import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { HomeLayoutSection, WritingData } from '@/data/types';

interface WritingSectionProps {
  section: HomeLayoutSection;
  writingData: WritingData | null;
}

export function WritingSection({ section, writingData }: WritingSectionProps) {
  // Get all published writing items, flattened
  const allItems = writingData?.categories.flatMap(cat => 
    cat.items.filter(item => item.published)
  ) || [];

  // Take first 3-4 items (could add featured flag later)
  const featuredItems = allItems.slice(0, 4);

  if (featuredItems.length === 0) return null;

  return (
    <section className="mb-16 md:mb-24">
      <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-6">
        {section.titleOverride || 'Selected Writing'}
      </h2>
      <div className="space-y-4">
        {featuredItems.map(item => (
          <Link 
            key={item.id}
            to={`/writing#${item.slug}`}
            className="group block p-4 -mx-4 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium mb-1">{item.title}</h3>
                <p className="text-muted-foreground line-clamp-1">{item.excerpt}</p>
              </div>
              <ArrowRight 
                size={16} 
                className="shrink-0 text-muted-foreground group-hover:translate-x-1 transition-transform mt-1" 
              />
            </div>
          </Link>
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
