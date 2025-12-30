import { useSettings } from '@/contexts/SettingsContext';
import { Seo } from '@/components/seo';
import { usePageView, useAnalytics } from '@/hooks/use-analytics';
import { Mail, Linkedin, Calendar, ExternalLink } from 'lucide-react';

export default function ContactPage() {
  usePageView('contact');
  const { track } = useAnalytics();
  const { settings } = useSettings();
  const socialLinks = settings?.socialLinks ?? {};

  return (
    <>
      <Seo title="Contact" description={`Get in touch with ${settings?.ownerName ?? 'me'}`} />
      
      <div className="container-prose py-16 md:py-24">
        <h1 className="mb-2">Contact</h1>
        <p className="text-muted-foreground mb-12">
          Get in touch for opportunities or just to say hello.
        </p>

        {/* Primary Contact Methods */}
        <section className="space-y-4 mb-12">
          {/* Email */}
          <a
            href={`mailto:${settings?.ownerEmail ?? 'hello@example.com'}`}
            onClick={() => track('contact_click', { metadata: { type: 'email' } })}
            className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-foreground/30 transition-colors group"
          >
            <Mail size={20} className="text-muted-foreground group-hover:text-foreground transition-colors" />
            <div>
              <div className="font-medium">Email</div>
              <div className="text-sm text-muted-foreground">{settings?.ownerEmail ?? 'hello@example.com'}</div>
            </div>
          </a>

          {/* LinkedIn */}
          {socialLinks.linkedin && (
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('contact_click', { metadata: { type: 'linkedin' } })}
              className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-foreground/30 transition-colors group"
            >
              <Linkedin size={20} className="text-muted-foreground group-hover:text-foreground transition-colors" />
              <div>
                <div className="font-medium">LinkedIn</div>
                <div className="text-sm text-muted-foreground">Connect with me</div>
              </div>
            </a>
          )}

          {/* Calendar */}
          {settings?.calendarUrl && (
            <a
              href={settings.calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('contact_click', { metadata: { type: 'calendar' } })}
              className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-foreground/30 transition-colors group"
            >
              <Calendar size={20} className="text-muted-foreground group-hover:text-foreground transition-colors" />
              <div>
                <div className="font-medium">Schedule a Call</div>
                <div className="text-sm text-muted-foreground">Book time on my calendar</div>
              </div>
            </a>
          )}
        </section>

        {/* External Links */}
        {settings?.externalLinks && settings.externalLinks.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4 text-muted-foreground uppercase tracking-wide">
              Elsewhere
            </h2>
            <div className="space-y-2">
              {settings.externalLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors py-2"
                >
                  <ExternalLink size={16} />
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
