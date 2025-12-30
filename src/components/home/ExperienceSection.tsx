import type { HomeLayoutSection } from '@/data/types';

interface ExperienceItem {
  company: string;
  role: string;
  years: string;
}

interface ExperienceSectionProps {
  section: HomeLayoutSection;
}

export function ExperienceSection({ section }: ExperienceSectionProps) {
  const config = section.config as { items?: ExperienceItem[] } | undefined;
  const items = config?.items || [];

  if (items.length === 0) return null;

  return (
    <section className="mb-16 md:mb-24">
      <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-6">
        {section.titleOverride || 'Experience'}
      </h2>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div 
            key={index} 
            className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-0"
          >
            <span className="font-medium min-w-[140px]">{item.company}</span>
            <span className="text-muted-foreground flex-1">{item.role}</span>
            <span className="text-sm text-muted-foreground tabular-nums">{item.years}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
