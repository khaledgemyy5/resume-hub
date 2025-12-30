import type { HomeLayoutSection } from '@/data/types';

interface AvailabilitySectionProps {
  section: HomeLayoutSection;
}

export function AvailabilitySection({ section }: AvailabilitySectionProps) {
  const config = section.config as { openTo?: string[]; focusAreas?: string[] } | undefined;
  const openTo = config?.openTo || [];
  const focusAreas = config?.focusAreas || [];

  if (openTo.length === 0 && focusAreas.length === 0) return null;

  return (
    <section className="mb-16 md:mb-24">
      <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-6">
        {section.titleOverride || 'Availability & Focus'}
      </h2>
      <div className="grid sm:grid-cols-2 gap-8">
        {openTo.length > 0 && (
          <div>
            <h3 className="font-medium mb-3">Open to</h3>
            <ul className="space-y-2">
              {openTo.map((item, index) => (
                <li key={index} className="text-muted-foreground">{item}</li>
              ))}
            </ul>
          </div>
        )}
        {focusAreas.length > 0 && (
          <div>
            <h3 className="font-medium mb-3">Focus Areas</h3>
            <ul className="space-y-2">
              {focusAreas.map((item, index) => (
                <li key={index} className="text-muted-foreground">{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
