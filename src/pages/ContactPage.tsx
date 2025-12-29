import { useSettings } from '@/contexts/SettingsContext';
import { Button, Input } from '@/components/ui-kit';
import { Mail, Github, Linkedin, Twitter } from 'lucide-react';

export default function ContactPage() {
  const { settings } = useSettings();
  const socialLinks = settings?.socialLinks ?? {};

  return (
    <div className="container-prose py-16 md:py-24">
      <h1 className="mb-2">Contact</h1>
      <p className="text-muted-foreground mb-12">
        Get in touch for opportunities or just to say hello.
      </p>

      {/* Email */}
      <section className="mb-12">
        <a
          href={`mailto:${settings?.ownerEmail ?? 'hello@example.com'}`}
          className="group flex items-center gap-3 text-lg hover:text-muted-foreground transition-colors"
        >
          <Mail size={20} />
          <span>{settings?.ownerEmail ?? 'hello@example.com'}</span>
        </a>
      </section>

      {/* Social Links */}
      {(socialLinks.github || socialLinks.linkedin || socialLinks.twitter) && (
        <section className="mb-12">
          <h2 className="text-lg font-semibold mb-4 text-muted-foreground uppercase tracking-wide">
            Elsewhere
          </h2>
          
          <div className="flex flex-col gap-3">
            {socialLinks.github && (
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github size={18} />
                <span>GitHub</span>
              </a>
            )}
            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin size={18} />
                <span>LinkedIn</span>
              </a>
            )}
            {socialLinks.twitter && (
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter size={18} />
                <span>Twitter</span>
              </a>
            )}
          </div>
        </section>
      )}

      {/* Simple Contact Form Placeholder */}
      <section>
        <h2 className="text-lg font-semibold mb-4 text-muted-foreground uppercase tracking-wide">
          Send a Message
        </h2>
        
        <form className="space-y-4 max-w-md" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
            <Input id="name" placeholder="Your name" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <Input id="email" type="email" placeholder="your@email.com" />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
            <textarea
              id="message"
              rows={4}
              placeholder="Your message..."
              className="flex w-full rounded border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <Button type="submit">Send Message</Button>
        </form>
      </section>
    </div>
  );
}
