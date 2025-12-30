import { useEffect, useState } from 'react';
import { dataClient } from '@/data';
import type { SiteSettings, ResumeData, ExternalLink } from '@/data/types';
import { Button, Input, Toggle } from '@/components/ui-kit';
import { Save, Plus, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AdminPages() {
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
        resumePdfUrl: settings.resumePdfUrl,
        resumeData: settings.resumeData,
        calendarUrl: settings.calendarUrl,
        externalLinks: settings.externalLinks,
      });
      toast({ title: 'Saved', description: 'Page settings updated.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to save.', variant: 'destructive' });
    }
    setIsSaving(false);
  };

  const updateResumeData = (field: keyof ResumeData, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      resumeData: { ...settings.resumeData!, [field]: value },
    });
  };

  const addExperience = () => {
    if (!settings?.resumeData) return;
    updateResumeData('experience', [
      ...settings.resumeData.experience,
      { title: '', company: '', period: '', description: '' },
    ]);
  };

  const updateExperience = (idx: number, field: string, value: string) => {
    if (!settings?.resumeData) return;
    const exp = [...settings.resumeData.experience];
    exp[idx] = { ...exp[idx], [field]: value };
    updateResumeData('experience', exp);
  };

  const removeExperience = (idx: number) => {
    if (!settings?.resumeData) return;
    updateResumeData('experience', settings.resumeData.experience.filter((_, i) => i !== idx));
  };

  const addEducation = () => {
    if (!settings?.resumeData) return;
    updateResumeData('education', [
      ...settings.resumeData.education,
      { degree: '', institution: '', period: '' },
    ]);
  };

  const updateEducation = (idx: number, field: string, value: string) => {
    if (!settings?.resumeData) return;
    const edu = [...settings.resumeData.education];
    edu[idx] = { ...edu[idx], [field]: value };
    updateResumeData('education', edu);
  };

  const removeEducation = (idx: number) => {
    if (!settings?.resumeData) return;
    updateResumeData('education', settings.resumeData.education.filter((_, i) => i !== idx));
  };

  const addLink = () => {
    if (!settings) return;
    setSettings({
      ...settings,
      externalLinks: [...(settings.externalLinks || []), { id: `l-${Date.now()}`, label: '', url: '' }],
    });
  };

  const updateLink = (idx: number, field: string, value: string) => {
    if (!settings?.externalLinks) return;
    const links = [...settings.externalLinks];
    links[idx] = { ...links[idx], [field]: value };
    setSettings({ ...settings, externalLinks: links });
  };

  const removeLink = (idx: number) => {
    if (!settings?.externalLinks) return;
    setSettings({ ...settings, externalLinks: settings.externalLinks.filter((_, i) => i !== idx) });
  };

  if (isLoading) {
    return <p className="text-muted-foreground animate-pulse">Loading...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pages</h1>
          <p className="text-muted-foreground">Resume & Contact page settings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.open('/resume', '_blank')}>
            <Eye size={14} className="mr-2" /> Resume
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.open('/contact', '_blank')}>
            <Eye size={14} className="mr-2" /> Contact
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            <Save size={14} className="mr-2" /> {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Resume */}
      <div className="border border-border rounded-lg p-4 space-y-4">
        <h2 className="font-semibold">Resume</h2>
        
        <div>
          <label className="text-sm text-muted-foreground">PDF URL</label>
          <Input 
            value={settings?.resumePdfUrl ?? ''} 
            onChange={e => setSettings({ ...settings!, resumePdfUrl: e.target.value || undefined })} 
            placeholder="https://..."
          />
        </div>

        {/* Experience */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Experience</label>
            <Button variant="ghost" size="sm" onClick={addExperience}>
              <Plus size={14} className="mr-1" /> Add
            </Button>
          </div>
          {settings?.resumeData?.experience.map((exp, i) => (
            <div key={i} className="p-3 bg-muted/50 rounded mb-2 space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">#{i + 1}</span>
                <Button variant="ghost" size="sm" onClick={() => removeExperience(i)}>
                  <Trash2 size={14} />
                </Button>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <Input value={exp.title} onChange={e => updateExperience(i, 'title', e.target.value)} placeholder="Title" />
                <Input value={exp.company} onChange={e => updateExperience(i, 'company', e.target.value)} placeholder="Company" />
                <Input value={exp.period} onChange={e => updateExperience(i, 'period', e.target.value)} placeholder="Period" />
              </div>
              <textarea 
                value={exp.description} 
                onChange={e => updateExperience(i, 'description', e.target.value)} 
                placeholder="Description"
                rows={2}
                className="w-full px-3 py-2 rounded border border-input bg-background text-sm resize-none"
              />
            </div>
          ))}
        </div>

        {/* Skills */}
        <div>
          <label className="text-sm text-muted-foreground">Skills (comma separated)</label>
          <Input 
            value={settings?.resumeData?.skills.join(', ') ?? ''} 
            onChange={e => updateResumeData('skills', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} 
          />
        </div>

        {/* Education */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Education</label>
            <Button variant="ghost" size="sm" onClick={addEducation}>
              <Plus size={14} className="mr-1" /> Add
            </Button>
          </div>
          {settings?.resumeData?.education.map((edu, i) => (
            <div key={i} className="p-3 bg-muted/50 rounded mb-2 space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">#{i + 1}</span>
                <Button variant="ghost" size="sm" onClick={() => removeEducation(i)}>
                  <Trash2 size={14} />
                </Button>
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                <Input value={edu.degree} onChange={e => updateEducation(i, 'degree', e.target.value)} placeholder="Degree" />
                <Input value={edu.institution} onChange={e => updateEducation(i, 'institution', e.target.value)} placeholder="Institution" />
                <Input value={edu.period} onChange={e => updateEducation(i, 'period', e.target.value)} placeholder="Period" />
              </div>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div>
          <label className="text-sm text-muted-foreground">Certifications (comma separated)</label>
          <Input 
            value={settings?.resumeData?.certifications?.join(', ') ?? ''} 
            onChange={e => updateResumeData('certifications', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} 
          />
        </div>
      </div>

      {/* Contact */}
      <div className="border border-border rounded-lg p-4 space-y-4">
        <h2 className="font-semibold">Contact</h2>
        
        <div>
          <label className="text-sm text-muted-foreground">Calendar URL</label>
          <Input 
            value={settings?.calendarUrl ?? ''} 
            onChange={e => setSettings({ ...settings!, calendarUrl: e.target.value || undefined })} 
            placeholder="https://cal.com/..."
          />
        </div>

        {/* External Links */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">External Links</label>
            <Button variant="ghost" size="sm" onClick={addLink}>
              <Plus size={14} className="mr-1" /> Add
            </Button>
          </div>
          {settings?.externalLinks?.map((link, i) => (
            <div key={link.id} className="flex gap-2 mb-2">
              <Input value={link.label} onChange={e => updateLink(i, 'label', e.target.value)} placeholder="Label" />
              <Input value={link.url} onChange={e => updateLink(i, 'url', e.target.value)} placeholder="URL" className="flex-1" />
              <Button variant="ghost" size="sm" onClick={() => removeLink(i)}>
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
