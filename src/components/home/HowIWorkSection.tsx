import type { HomeLayoutSection } from '@/data/types';

interface HowIWorkSectionProps {
  section: HomeLayoutSection;
}

export function HowIWorkSection({ section }: HowIWorkSectionProps) {
  const config = section.config as { items?: string[] } | undefined;
  const items = config?.items || [];

  if (items.length === 0) return null;

  return (
    <section className="mb-16 md:mb-24">
      <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-6">
        {section.titleOverride || 'How I Work'}
      </h2>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="text-muted-foreground select-none">—</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
