import { Mail, Linkedin, Calendar } from 'lucide-react';
import type { HomeLayoutSection } from '@/data/types';

interface ContactCtaSectionProps {
  section: HomeLayoutSection;
}

export function ContactCtaSection({ section }: ContactCtaSectionProps) {
  const config = section.config as { email?: string; linkedin?: string; calendarUrl?: string } | undefined;
  const email = config?.email || '';
  const linkedin = config?.linkedin || '';
  const calendarUrl = config?.calendarUrl || '';

  const hasAnyContact = email || linkedin || calendarUrl;

  if (!hasAnyContact) return null;

  return (
    <section className="mb-16 md:mb-24">
      <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-6">
        {section.titleOverride || 'Get in Touch'}
      </h2>
      <div className="space-y-4">
        {email && (
          <a 
            href={`mailto:${email}`}
            className="group flex items-center gap-3 text-foreground hover:text-muted-foreground transition-colors"
          >
            <Mail size={18} className="text-muted-foreground" />
            <span>{email}</span>
          </a>
        )}
        {linkedin && (
          <a 
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 text-foreground hover:text-muted-foreground transition-colors"
          >
            <Linkedin size={18} className="text-muted-foreground" />
            <span>LinkedIn Profile</span>
          </a>
        )}
        {calendarUrl && (
          <a 
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 text-foreground hover:text-muted-foreground transition-colors"
          >
            <Calendar size={18} className="text-muted-foreground" />
            <span>Book a Call</span>
          </a>
        )}
      </div>
    </section>
  );
}
