import { useSettings } from '@/contexts/SettingsContext';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  const { settings } = useSettings();

  return (
    <div className="container-prose py-16 md:py-24">
      {/* Hero Section */}
      <section className="mb-16">
        <h1 className="font-display mb-4">
          {settings?.ownerName ?? 'Hello'}
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl">
          {settings?.siteDescription ?? 'A minimalist personal portfolio and resume site.'}
        </p>
      </section>

      {/* Quick Links */}
      <section className="space-y-6">
        <div className="flex flex-col gap-3">
          <Link 
            to="/projects" 
            className="group flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors"
          >
            <span className="text-lg">View Projects</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            to="/resume" 
            className="group flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors"
          >
            <span className="text-lg">Read Resume</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            to="/contact" 
            className="group flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors"
          >
            <span className="text-lg">Get in Touch</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
