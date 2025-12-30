import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { HomeLayoutSection } from '@/data/types';

interface HeroSectionProps {
  section: HomeLayoutSection;
  ownerName?: string;
}

export function HeroSection({ section, ownerName }: HeroSectionProps) {
  const config = section.config as { name?: string; title?: string; valueProp?: string } | undefined;
  const name = config?.name || ownerName || 'Hello';
  const title = config?.title || '';
  const valueProp = config?.valueProp || '';

  return (
    <section className="mb-16 md:mb-24">
      <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
        {section.titleOverride || name}
      </h1>
      {title && (
        <p className="text-xl md:text-2xl text-muted-foreground mb-4">{title}</p>
      )}
      {valueProp && (
        <p className="text-lg text-muted-foreground max-w-xl mb-8">{valueProp}</p>
      )}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          to="/resume" 
          className="group inline-flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors"
        >
          <span className="text-lg font-medium">View Resume</span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link 
          to="/projects" 
          className="group inline-flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors"
        >
          <span className="text-lg font-medium">See Projects</span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
