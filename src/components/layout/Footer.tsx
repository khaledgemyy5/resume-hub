import { useSettings } from '@/contexts/SettingsContext';
import { Github, Linkedin, Twitter } from 'lucide-react';

export function Footer() {
  const { settings } = useSettings();

  const socialLinks = settings?.socialLinks ?? {};

  return (
    <footer className="border-t border-border mt-auto">
      <div className="container-wide py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {settings?.ownerName ?? 'Portfolio'}
        </p>

        <div className="flex items-center gap-4">
          {socialLinks.github && (
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
          )}
          {socialLinks.linkedin && (
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
          )}
          {socialLinks.twitter && (
            <a
              href={socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={18} />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
