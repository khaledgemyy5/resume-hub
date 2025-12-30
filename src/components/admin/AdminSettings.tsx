import { useEffect, useState } from 'react';
import { dataClient } from '@/data';
import type { SiteSettings, NavItem } from '@/data/types';
import { Button, Input, Toggle } from '@/components/ui-kit';
import { Save, Plus, Trash2, GripVertical, ChevronUp, ChevronDown, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

export function AdminSettings() {
  const { user } = useAdminAuth();
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
        ownerName: settings.ownerName,
        ownerEmail: settings.ownerEmail,
        socialLinks: settings.socialLinks,
        navigation: settings.navigation,
      });
      toast({ title: 'Saved', description: 'Settings updated.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to save.', variant: 'destructive' });
    }
    setIsSaving(false);
  };

  const updateNav = (id: string, field: keyof NavItem, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      navigation: settings.navigation.map(n => n.id === id ? { ...n, [field]: value } : n),
    });
  };

  const moveNav = (id: string, direction: 'up' | 'down') => {
    if (!settings) return;
    const sorted = [...settings.navigation].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex(n => n.id === id);
    if (direction === 'up' && idx > 0) {
      const temp = sorted[idx].order;
      sorted[idx].order = sorted[idx - 1].order;
      sorted[idx - 1].order = temp;
    } else if (direction === 'down' && idx < sorted.length - 1) {
      const temp = sorted[idx].order;
      sorted[idx].order = sorted[idx + 1].order;
      sorted[idx + 1].order = temp;
    }
    setSettings({ ...settings, navigation: sorted });
  };

  const addNav = () => {
    if (!settings) return;
    const newNav: NavItem = {
      id: `nav-${Date.now()}`,
      label: 'New Link',
      href: '/new',
      enabled: true,
      order: settings.navigation.length,
    };
    setSettings({ ...settings, navigation: [...settings.navigation, newNav] });
  };

  const removeNav = (id: string) => {
    if (!settings) return;
    setSettings({ ...settings, navigation: settings.navigation.filter(n => n.id !== id) });
  };

  if (isLoading) {
    return <p className="text-muted-foreground animate-pulse">Loading...</p>;
  }

  const sortedNav = [...(settings?.navigation ?? [])].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Site configuration and security</p>
        </div>
        <Button size="sm" onClick={handleSave} disabled={isSaving}>
          <Save size={14} className="mr-2" /> {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>

      {/* General */}
      <div className="border border-border rounded-lg p-4 space-y-4">
        <h2 className="font-semibold">General</h2>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm text-muted-foreground">Site Name</label>
            <Input 
              value={settings?.siteName ?? ''} 
              onChange={e => setSettings({ ...settings!, siteName: e.target.value })} 
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Owner Name</label>
            <Input 
              value={settings?.ownerName ?? ''} 
              onChange={e => setSettings({ ...settings!, ownerName: e.target.value })} 
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Owner Email</label>
            <Input 
              value={settings?.ownerEmail ?? ''} 
              onChange={e => setSettings({ ...settings!, ownerEmail: e.target.value })} 
              type="email"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Owner Title</label>
            <Input 
              value={settings?.ownerTitle ?? ''} 
              onChange={e => setSettings({ ...settings!, ownerTitle: e.target.value })} 
              placeholder="Software Engineer"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Site Description</label>
          <textarea 
            value={settings?.siteDescription ?? ''} 
            onChange={e => setSettings({ ...settings!, siteDescription: e.target.value })} 
            rows={2}
            className="w-full px-3 py-2 rounded border border-input bg-background text-sm resize-none"
          />
        </div>
      </div>

      {/* Social Links */}
      <div className="border border-border rounded-lg p-4 space-y-4">
        <h2 className="font-semibold">Social Links</h2>
        
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-sm text-muted-foreground">GitHub</label>
            <Input 
              value={settings?.socialLinks?.github ?? ''} 
              onChange={e => setSettings({ ...settings!, socialLinks: { ...settings!.socialLinks, github: e.target.value || undefined } })} 
              placeholder="https://github.com/..."
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">LinkedIn</label>
            <Input 
              value={settings?.socialLinks?.linkedin ?? ''} 
              onChange={e => setSettings({ ...settings!, socialLinks: { ...settings!.socialLinks, linkedin: e.target.value || undefined } })} 
              placeholder="https://linkedin.com/in/..."
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Twitter</label>
            <Input 
              value={settings?.socialLinks?.twitter ?? ''} 
              onChange={e => setSettings({ ...settings!, socialLinks: { ...settings!.socialLinks, twitter: e.target.value || undefined } })} 
              placeholder="https://twitter.com/..."
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border border-border rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Navigation</h2>
          <Button variant="ghost" size="sm" onClick={addNav}>
            <Plus size={14} className="mr-1" /> Add
          </Button>
        </div>
        
        <div className="space-y-2">
          {sortedNav.map((nav, idx) => (
            <div key={nav.id} className="flex items-center gap-2 p-3 bg-muted/50 rounded">
              <GripVertical size={14} className="text-muted-foreground" />
              <Input 
                value={nav.label} 
                onChange={e => updateNav(nav.id, 'label', e.target.value)} 
                className="w-24"
              />
              <Input 
                value={nav.href} 
                onChange={e => updateNav(nav.id, 'href', e.target.value)} 
                className="flex-1"
              />
              <Toggle checked={nav.enabled} onChange={checked => updateNav(nav.id, 'enabled', checked)} />
              <div className="flex">
                <Button variant="ghost" size="sm" onClick={() => moveNav(nav.id, 'up')} disabled={idx === 0} className="h-7 px-1">
                  <ChevronUp size={14} />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => moveNav(nav.id, 'down')} disabled={idx === sortedNav.length - 1} className="h-7 px-1">
                  <ChevronDown size={14} />
                </Button>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeNav(nav.id)}>
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="border border-border rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Shield size={18} />
          <h2 className="font-semibold">Security</h2>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p className="mb-2">Currently logged in as: <strong>{user?.email}</strong></p>
          <p>In production, this would include:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Password change</li>
            <li>Two-factor authentication</li>
            <li>Session management</li>
            <li>API key management</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
