import type { HomeLayoutSection } from '@/data/types';

interface MetricItem {
  label: string;
  value: string;
}

interface MetricsSectionProps {
  section: HomeLayoutSection;
}

export function MetricsSection({ section }: MetricsSectionProps) {
  const config = section.config as { items?: MetricItem[] } | undefined;
  const items = config?.items || [];

  if (items.length === 0) return null;

  return (
    <section className="mb-16 md:mb-24">
      <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-6">
        {section.titleOverride || 'Metrics Mindset'}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <div key={index}>
            <div className="text-2xl md:text-3xl font-bold tabular-nums">{item.value}</div>
            <div className="text-sm text-muted-foreground">{item.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
