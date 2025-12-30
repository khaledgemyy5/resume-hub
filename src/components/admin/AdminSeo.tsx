import { useEffect, useState } from 'react';
import { dataClient } from '@/data';
import type { SiteSettings, SeoDefaults } from '@/data/types';
import { Button, Input } from '@/components/ui-kit';
import { Save, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AdminSeo() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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
        siteName: settings.siteName,
        siteDescription: settings.siteDescription,
        seoDefaults: settings.seoDefaults,
        faviconUrl: settings.faviconUrl,
        appleTouchIconUrl: settings.appleTouchIconUrl,
      });
      toast({ title: 'Saved', description: 'SEO settings updated.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to save.', variant: 'destructive' });
    }
    setIsSaving(false);
  };

  const updateSeo = (field: keyof SeoDefaults, value: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      seoDefaults: { 
        ...settings.seoDefaults!, 
        [field]: value || undefined 
      },
    });
  };

  if (isLoading) {
    return <p className="text-muted-foreground animate-pulse">Loading...</p>;
  }

  const seo = settings?.seoDefaults;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">SEO</h1>
          <p className="text-muted-foreground">Search engine optimization settings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.open('/', '_blank')}>
            <Eye size={14} className="mr-2" /> Preview
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            <Save size={14} className="mr-2" /> {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Global SEO */}
      <div className="border border-border rounded-lg p-4 space-y-4">
        <h2 className="font-semibold">Global Defaults</h2>
        
        <div>
          <label className="text-sm text-muted-foreground">Site Name</label>
          <Input 
            value={settings?.siteName ?? ''} 
            onChange={e => setSettings({ ...settings!, siteName: e.target.value })} 
            placeholder="Your Portfolio"
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Site Description</label>
          <textarea 
            value={settings?.siteDescription ?? ''} 
            onChange={e => setSettings({ ...settings!, siteDescription: e.target.value })} 
            placeholder="A brief description of your site"
            rows={2}
            className="w-full px-3 py-2 rounded border border-input bg-background text-sm resize-none"
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Default Title (for homepage)</label>
          <Input 
            value={seo?.title ?? ''} 
            onChange={e => updateSeo('title', e.target.value)} 
            placeholder="Name | Title"
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Default Description</label>
          <textarea 
            value={seo?.description ?? ''} 
            onChange={e => updateSeo('description', e.target.value)} 
            placeholder="Default meta description"
            rows={2}
            className="w-full px-3 py-2 rounded border border-input bg-background text-sm resize-none"
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground">OG Image URL</label>
          <Input 
            value={seo?.ogImage ?? ''} 
            onChange={e => updateSeo('ogImage', e.target.value)} 
            placeholder="https://..."
          />
          <p className="text-xs text-muted-foreground mt-1">
            Recommended: 1200x630px
          </p>
        </div>
      </div>

      {/* Favicon */}
      <div className="border border-border rounded-lg p-4 space-y-4">
        <h2 className="font-semibold">Favicon</h2>
        
        <div>
          <label className="text-sm text-muted-foreground">Favicon URL</label>
          <div className="flex gap-2">
            <Input 
              value={settings?.faviconUrl ?? ''} 
              onChange={e => setSettings({ ...settings!, faviconUrl: e.target.value || undefined })} 
              placeholder="/favicon.ico"
              className="flex-1"
            />
            {settings?.faviconUrl && (
              <img src={settings.faviconUrl} alt="favicon" className="w-10 h-10 rounded border border-border" />
            )}
          </div>
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Apple Touch Icon URL</label>
          <div className="flex gap-2">
            <Input 
              value={settings?.appleTouchIconUrl ?? ''} 
              onChange={e => setSettings({ ...settings!, appleTouchIconUrl: e.target.value || undefined })} 
              placeholder="/apple-touch-icon.png"
              className="flex-1"
            />
            {settings?.appleTouchIconUrl && (
              <img src={settings.appleTouchIconUrl} alt="apple icon" className="w-10 h-10 rounded border border-border" />
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Recommended: 180x180px
          </p>
        </div>
      </div>

      {/* Per-Page Overrides Info */}
      <div className="border border-border rounded-lg p-4">
        <h2 className="font-semibold mb-2">Per-Page Overrides</h2>
        <p className="text-sm text-muted-foreground">
          Individual pages automatically generate SEO based on their content. 
          Project pages use the project title and headline. 
          Writing pages use category and item titles.
        </p>
        <div className="mt-4 text-xs text-muted-foreground space-y-1">
          <div><strong>/</strong> → Uses global defaults</div>
          <div><strong>/projects</strong> → "Projects | Site Name"</div>
          <div><strong>/projects/:slug</strong> → "Project Title | Site Name"</div>
          <div><strong>/resume</strong> → "Resume | Site Name"</div>
          <div><strong>/contact</strong> → "Contact | Site Name"</div>
          <div><strong>/writing</strong> → "Writing | Site Name"</div>
        </div>
      </div>
    </div>
  );
}
