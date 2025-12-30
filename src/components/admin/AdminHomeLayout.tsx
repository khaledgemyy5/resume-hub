import { useEffect, useState } from 'react';
import { dataClient } from '@/data';
import type { HomeLayout, HomeLayoutSection } from '@/data/types';
import { Button, Input, Toggle, Badge } from '@/components/ui-kit';
import { GripVertical, ChevronUp, ChevronDown, Eye, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SECTION_LABELS: Record<string, string> = {
  hero: 'Hero',
  experience: 'Experience Snapshot',
  featuredProjects: 'Featured Projects',
  howIWork: 'How I Work',
  metrics: 'Metrics Mindset',
  availability: 'Availability / Focus',
  writing: 'Selected Writing',
  contactCta: 'Contact CTA',
};

export function AdminHomeLayout() {
  const [layout, setLayout] = useState<HomeLayout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadLayout();
  }, []);

  const loadLayout = async () => {
    const data = await dataClient.adminGetHomeLayout();
    setLayout(data);
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!layout) return;
    setIsSaving(true);
    try {
      await dataClient.adminUpdateHomeLayout({ sections: layout.sections });
      toast({ title: 'Saved', description: 'Home layout updated.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to save.', variant: 'destructive' });
    }
    setIsSaving(false);
  };

  const handleToggle = (id: string, enabled: boolean) => {
    if (!layout) return;
    setLayout({
      ...layout,
      sections: layout.sections.map(s => s.id === id ? { ...s, enabled } : s),
    });
  };

  const handleTitleOverride = (id: string, titleOverride: string) => {
    if (!layout) return;
    setLayout({
      ...layout,
      sections: layout.sections.map(s => 
        s.id === id ? { ...s, titleOverride: titleOverride || undefined } : s
      ),
    });
  };

  const handleMove = (id: string, direction: 'up' | 'down') => {
    if (!layout) return;
    const sorted = [...layout.sections].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex(s => s.id === id);
    if (direction === 'up' && idx > 0) {
      const temp = sorted[idx].order;
      sorted[idx].order = sorted[idx - 1].order;
      sorted[idx - 1].order = temp;
    } else if (direction === 'down' && idx < sorted.length - 1) {
      const temp = sorted[idx].order;
      sorted[idx].order = sorted[idx + 1].order;
      sorted[idx + 1].order = temp;
    }
    setLayout({ ...layout, sections: sorted });
  };

  const handlePreview = () => {
    window.open('/', '_blank');
  };

  if (isLoading) {
    return <p className="text-muted-foreground animate-pulse">Loading...</p>;
  }

  const sortedSections = [...(layout?.sections ?? [])].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Home Layout</h1>
          <p className="text-muted-foreground">Configure your homepage sections</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePreview}>
            <Eye size={14} className="mr-2" /> Preview
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            <Save size={14} className="mr-2" /> {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {sortedSections.map((section, idx) => (
          <div 
            key={section.id}
            className={`flex items-center gap-3 p-4 border rounded-lg transition-colors ${
              section.enabled ? 'border-border bg-background' : 'border-border/50 bg-muted/30'
            }`}
          >
            <GripVertical size={16} className="text-muted-foreground cursor-grab" />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">{SECTION_LABELS[section.type] || section.type}</span>
                <Badge variant={section.enabled ? 'default' : 'secondary'}>
                  {section.enabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <Input
                value={section.titleOverride ?? ''}
                onChange={(e) => handleTitleOverride(section.id, e.target.value)}
                placeholder="Title override (optional)"
                className="text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <Toggle 
                checked={section.enabled} 
                onChange={(checked) => handleToggle(section.id, checked)} 
              />
              <div className="flex flex-col">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleMove(section.id, 'up')}
                  disabled={idx === 0}
                  className="h-6 px-1"
                >
                  <ChevronUp size={14} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleMove(section.id, 'down')}
                  disabled={idx === sortedSections.length - 1}
                  className="h-6 px-1"
                >
                  <ChevronDown size={14} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Tip: Sections with no content (e.g., empty Featured Projects) will be hidden automatically.
      </p>
    </div>
  );
}
