import { Link } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const { settings, writingData, isDark, toggleTheme } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filter navigation items: enabled AND auto-hide Writing if empty
  const navItems = (settings?.navigation ?? [])
    .filter((item) => item.enabled)
    .filter((item) => {
      if (item.href === '/writing') {
        const hasPublishedWriting = writingData?.categories.some(
          (cat) => cat.items.some((item) => item.published)
        );
        return hasPublishedWriting;
      }
      return true;
    })
    .sort((a, b) => a.order - b.order);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container-wide flex h-14 items-center justify-between">
        {/* Logo / Site Name */}
        <Link 
          to="/" 
          className="text-lg font-semibold tracking-tight hover:text-muted-foreground transition-colors"
        >
          {settings?.siteName ?? 'Portfolio'}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background animate-fade-in">
          <div className="container-wide py-4 flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
