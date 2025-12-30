import { useEffect, useState } from 'react';
import { dataClient } from '@/data';
import type { SiteSettings } from '@/data/types';
import { Button, Input, Toggle } from '@/components/ui-kit';
import { Save, Eye, Sun, Moon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FONT_OPTIONS = [
  { value: 'system-ui, -apple-system, sans-serif', label: 'System (Default)' },
  { value: "'Inter', sans-serif", label: 'Inter' },
  { value: "'IBM Plex Mono', monospace", label: 'IBM Plex Mono' },
  { value: "'Playfair Display', serif", label: 'Playfair Display' },
];

export function AdminTheme() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewDark, setPreviewDark] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    dataClient.adminGetSettings().then(s => {
      setSettings(s);
      setIsLoading(false);
    });
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setIsSaving(true);
    try {
      await dataClient.adminUpdateSettings({
        theme: settings.theme,
      });
      toast({ title: 'Saved', description: 'Theme updated.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to save.', variant: 'destructive' });
    }
    setIsSaving(false);
  };

  const updateTheme = (field: keyof SiteSettings['theme'], value: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      theme: { ...settings.theme, [field]: value },
    });
  };

  if (isLoading) {
    return <p className="text-muted-foreground animate-pulse">Loading...</p>;
  }

  const theme = settings?.theme;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Theme</h1>
          <p className="text-muted-foreground">Customize colors and fonts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setPreviewDark(!previewDark)}>
            {previewDark ? <Sun size={14} className="mr-2" /> : <Moon size={14} className="mr-2" />}
            {previewDark ? 'Light' : 'Dark'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.open('/', '_blank')}>
            <Eye size={14} className="mr-2" /> Preview
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            <Save size={14} className="mr-2" /> {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Colors */}
      <div className="border border-border rounded-lg p-4 space-y-4">
        <h2 className="font-semibold">Colors</h2>
        <p className="text-xs text-muted-foreground">
          Use HSL values (e.g., "0 0% 100%" for white)
        </p>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm text-muted-foreground">Background</label>
            <div className="flex gap-2">
              <Input 
                value={theme?.colorBackground ?? ''} 
                onChange={e => updateTheme('colorBackground', e.target.value)} 
                placeholder="0 0% 100%"
              />
              <div 
                className="w-10 h-10 rounded border border-border shrink-0" 
                style={{ backgroundColor: `hsl(${theme?.colorBackground})` }} 
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm text-muted-foreground">Foreground</label>
            <div className="flex gap-2">
              <Input 
                value={theme?.colorForeground ?? ''} 
                onChange={e => updateTheme('colorForeground', e.target.value)} 
                placeholder="0 0% 3.9%"
              />
              <div 
                className="w-10 h-10 rounded border border-border shrink-0" 
                style={{ backgroundColor: `hsl(${theme?.colorForeground})` }} 
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm text-muted-foreground">Primary</label>
            <div className="flex gap-2">
              <Input 
                value={theme?.colorPrimary ?? ''} 
                onChange={e => updateTheme('colorPrimary', e.target.value)} 
                placeholder="0 0% 9%"
              />
              <div 
                className="w-10 h-10 rounded border border-border shrink-0" 
                style={{ backgroundColor: `hsl(${theme?.colorPrimary})` }} 
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm text-muted-foreground">Accent</label>
            <div className="flex gap-2">
              <Input 
                value={theme?.colorAccent ?? ''} 
                onChange={e => updateTheme('colorAccent', e.target.value)} 
                placeholder="0 0% 45%"
              />
              <div 
                className="w-10 h-10 rounded border border-border shrink-0" 
                style={{ backgroundColor: `hsl(${theme?.colorAccent})` }} 
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm text-muted-foreground">Muted</label>
            <div className="flex gap-2">
              <Input 
                value={theme?.colorMuted ?? ''} 
                onChange={e => updateTheme('colorMuted', e.target.value)} 
                placeholder="0 0% 96%"
              />
              <div 
                className="w-10 h-10 rounded border border-border shrink-0" 
                style={{ backgroundColor: `hsl(${theme?.colorMuted})` }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="border border-border rounded-lg p-4 space-y-4">
        <h2 className="font-semibold">Typography</h2>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm text-muted-foreground">Primary Font</label>
            <select 
              value={theme?.fontPrimary ?? ''} 
              onChange={e => updateTheme('fontPrimary', e.target.value)}
              className="w-full h-10 px-3 rounded border border-input bg-background text-sm"
            >
              {FONT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground mt-1" style={{ fontFamily: theme?.fontPrimary }}>
              The quick brown fox jumps over the lazy dog.
            </p>
          </div>
          
          <div>
            <label className="text-sm text-muted-foreground">Secondary Font</label>
            <select 
              value={theme?.fontSecondary ?? ''} 
              onChange={e => updateTheme('fontSecondary', e.target.value)}
              className="w-full h-10 px-3 rounded border border-input bg-background text-sm"
            >
              {FONT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground mt-1" style={{ fontFamily: theme?.fontSecondary }}>
              The quick brown fox jumps over the lazy dog.
            </p>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="border border-border rounded-lg p-4">
        <h2 className="font-semibold mb-4">Preview</h2>
        <div 
          className="p-6 rounded-lg"
          style={{ 
            backgroundColor: `hsl(${theme?.colorBackground})`,
            color: `hsl(${theme?.colorForeground})`,
            fontFamily: theme?.fontPrimary,
          }}
        >
          <h3 style={{ fontFamily: theme?.fontSecondary }} className="text-xl font-bold mb-2">
            Sample Heading
          </h3>
          <p style={{ color: `hsl(${theme?.colorAccent})` }} className="mb-4">
            This is sample text using your theme colors and fonts.
          </p>
          <button 
            style={{ 
              backgroundColor: `hsl(${theme?.colorPrimary})`,
              color: `hsl(${theme?.colorBackground})`,
            }}
            className="px-4 py-2 rounded text-sm"
          >
            Sample Button
          </button>
        </div>
      </div>
    </div>
  );
}
