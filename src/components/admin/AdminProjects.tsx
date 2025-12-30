import { useEffect, useState } from 'react';
import { dataClient } from '@/data';
import type { Project, ProjectContent, ProjectSections, ProjectDecision, ProjectMedia } from '@/data/types';
import { Button, Input, Badge, Toggle } from '@/components/ui-kit';
import { 
  Plus, Trash2, Eye, Save, ArrowLeft, ChevronDown, ChevronUp,
  Star, StarOff, ExternalLink, Image, Video
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type View = 'list' | 'edit';

export function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<View>('list');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const data = await dataClient.adminGetProjects();
    setProjects(data);
    setIsLoading(false);
  };

  const handleCreate = async () => {
    const newProject = await dataClient.adminCreateProject({
      slug: `project-${Date.now()}`,
      title: 'New Project',
      status: 'CONCEPT',
      featured: false,
      tags: [],
      order: projects.length,
    });
    // Create default content
    await dataClient.adminCreateProjectContent(newProject.id, {
      projectId: newProject.id,
      detailLevel: 'STANDARD',
      headline: '',
      summary: '',
      body: '',
    });
    await loadProjects();
    const updated = await dataClient.adminGetProject(newProject.id);
    if (updated) {
      setEditingProject(updated);
      setView('edit');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this project?')) {
      await dataClient.adminDeleteProject(id);
      await loadProjects();
      toast({ title: 'Deleted', description: 'Project deleted.' });
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setView('edit');
  };

  const handleBack = () => {
    setView('list');
    setEditingProject(null);
    loadProjects();
  };

  if (isLoading) {
    return <p className="text-muted-foreground animate-pulse">Loading...</p>;
  }

  if (view === 'edit' && editingProject) {
    return <ProjectEditor project={editingProject} onBack={handleBack} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage your portfolio projects</p>
        </div>
        <Button size="sm" onClick={handleCreate}>
          <Plus size={14} className="mr-2" /> Add Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No projects yet.</p>
      ) : (
        <div className="space-y-2">
          {projects.sort((a, b) => a.order - b.order).map((project) => (
            <div 
              key={project.id}
              className="flex items-center gap-4 p-4 border border-border rounded-lg hover:border-foreground/30 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{project.title}</span>
                  {project.featured && <Star size={14} className="text-yellow-500 fill-yellow-500" />}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={project.status === 'PUBLIC' ? 'default' : 'secondary'}>
                    {project.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">/{project.slug}</span>
                  {project.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-xs text-muted-foreground">{tag}</span>
                  ))}
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleEdit(project)}>
                Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(project.id)}>
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Project Editor Component
function ProjectEditor({ project, onBack }: { project: Project; onBack: () => void }) {
  const [data, setData] = useState(project);
  const [content, setContent] = useState<ProjectContent | null>(project.content[0] || null);
  const [sections, setSections] = useState<ProjectSections>(content?.sections || {});
  const [decisions, setDecisions] = useState<ProjectDecision[]>(content?.decisions || []);
  const [media, setMedia] = useState<ProjectMedia[]>(content?.media || []);
  const [relatedSlugs, setRelatedSlugs] = useState<string>(project.relatedProjectSlugs?.join(', ') || '');
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showDecisions, setShowDecisions] = useState(decisions.length > 0);
  const [showMedia, setShowMedia] = useState(media.length > 0);
  const { toast } = useToast();

  useEffect(() => {
    dataClient.adminGetProjects().then(setAllProjects);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Update project
      await dataClient.adminUpdateProject(data.id, {
        slug: data.slug,
        title: data.title,
        status: data.status,
        featured: data.featured,
        tags: data.tags,
        externalUrl: data.externalUrl,
        order: data.order,
      });

      // Update content
      if (content) {
        await dataClient.adminUpdateProjectContent(content.id, {
          headline: content.headline,
          summary: content.summary,
          body: JSON.stringify({ sections, decisions: showDecisions ? decisions : [], media: showMedia ? media : [] }),
        });
      }

      toast({ title: 'Saved', description: 'Project updated.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to save.', variant: 'destructive' });
    }
    setIsSaving(false);
  };

  const handlePreview = () => {
    window.open(`/projects/${data.slug}`, '_blank');
  };

  const sectionFields: { key: keyof ProjectSections; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'context', label: 'Context' },
    { key: 'problem', label: 'Problem' },
    { key: 'role', label: 'Your Role' },
    { key: 'constraints', label: 'Constraints' },
    { key: 'approach', label: 'Approach & Decisions' },
    { key: 'execution', label: 'Execution' },
    { key: 'impact', label: 'Impact' },
    { key: 'learnings', label: 'Learnings' },
    { key: 'links', label: 'Links' },
  ];

  const addDecision = () => {
    setDecisions([...decisions, { id: `d-${Date.now()}`, decision: '', tradeoff: '', outcome: '' }]);
  };

  const updateDecision = (id: string, field: keyof ProjectDecision, value: string) => {
    setDecisions(decisions.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const removeDecision = (id: string) => {
    setDecisions(decisions.filter(d => d.id !== id));
  };

  const addMedia = () => {
    setMedia([...media, { id: `m-${Date.now()}`, type: 'image', url: '', caption: '', order: media.length }]);
  };

  const updateMedia = (id: string, field: keyof ProjectMedia, value: string | number) => {
    setMedia(media.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const removeMedia = (id: string) => {
    setMedia(media.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft size={14} />
          </Button>
          <div>
            <h1 className="text-xl font-bold">{data.title}</h1>
            <p className="text-sm text-muted-foreground">/{data.slug}</p>
          </div>
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

      {/* Basic Info */}
      <div className="border border-border rounded-lg p-4 space-y-4">
        <h2 className="font-semibold">Basic Info</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm text-muted-foreground">Title</label>
            <Input value={data.title} onChange={e => setData({ ...data, title: e.target.value })} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Slug</label>
            <Input value={data.slug} onChange={e => setData({ ...data, slug: e.target.value })} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Status</label>
            <select 
              value={data.status} 
              onChange={e => setData({ ...data, status: e.target.value as Project['status'] })}
              className="w-full h-10 px-3 rounded border border-input bg-background text-sm"
            >
              <option value="CONCEPT">Concept</option>
              <option value="CONFIDENTIAL">Confidential</option>
              <option value="PUBLIC">Public</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">External URL</label>
            <Input 
              value={data.externalUrl ?? ''} 
              onChange={e => setData({ ...data, externalUrl: e.target.value || undefined })} 
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Tags (comma separated)</label>
            <Input 
              value={data.tags.join(', ')} 
              onChange={e => setData({ ...data, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} 
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <button type="button" onClick={() => setData({ ...data, featured: !data.featured })}>
                {data.featured ? <Star size={18} className="text-yellow-500 fill-yellow-500" /> : <StarOff size={18} />}
              </button>
              <span className="text-sm">Featured</span>
            </label>
          </div>
        </div>
      </div>

      {/* Headline & Summary */}
      <div className="border border-border rounded-lg p-4 space-y-4">
        <h2 className="font-semibold">Headline & Summary</h2>
        <div>
          <label className="text-sm text-muted-foreground">Headline</label>
          <Input 
            value={content?.headline ?? ''} 
            onChange={e => setContent(content ? { ...content, headline: e.target.value } : null)} 
            placeholder="One-liner about the project"
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Summary</label>
          <textarea 
            value={content?.summary ?? ''} 
            onChange={e => setContent(content ? { ...content, summary: e.target.value } : null)} 
            placeholder="Brief summary"
            rows={2}
            className="w-full px-3 py-2 rounded border border-input bg-background text-sm resize-none"
          />
        </div>
      </div>

      {/* Content Sections */}
      <div className="border border-border rounded-lg p-4 space-y-4">
        <h2 className="font-semibold">Content Sections</h2>
        <p className="text-xs text-muted-foreground">Leave blank to hide a section</p>
        {sectionFields.map(({ key, label }) => (
          <div key={key}>
            <label className="text-sm text-muted-foreground">{label}</label>
            <textarea 
              value={sections[key] ?? ''} 
              onChange={e => setSections({ ...sections, [key]: e.target.value || undefined })} 
              rows={3}
              className="w-full px-3 py-2 rounded border border-input bg-background text-sm resize-none"
            />
          </div>
        ))}
      </div>

      {/* Decision Log */}
      <div className="border border-border rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Decision Log</h2>
          <Toggle checked={showDecisions} onChange={setShowDecisions} label={showDecisions ? 'Enabled' : 'Disabled'} />
        </div>
        {showDecisions && (
          <div className="space-y-3">
            {decisions.map((d, i) => (
              <div key={d.id} className="p-3 bg-muted/50 rounded space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Decision {i + 1}</span>
                  <Button variant="ghost" size="sm" onClick={() => removeDecision(d.id)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
                <Input value={d.decision} onChange={e => updateDecision(d.id, 'decision', e.target.value)} placeholder="Decision" />
                <Input value={d.tradeoff} onChange={e => updateDecision(d.id, 'tradeoff', e.target.value)} placeholder="Trade-off" />
                <Input value={d.outcome} onChange={e => updateDecision(d.id, 'outcome', e.target.value)} placeholder="Outcome" />
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addDecision}>
              <Plus size={14} className="mr-2" /> Add Decision
            </Button>
          </div>
        )}
      </div>

      {/* Media */}
      <div className="border border-border rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Media (max 3)</h2>
          <Toggle checked={showMedia} onChange={setShowMedia} label={showMedia ? 'Enabled' : 'Disabled'} />
        </div>
        {showMedia && (
          <div className="space-y-3">
            {media.slice(0, 3).map((m, i) => (
              <div key={m.id} className="p-3 bg-muted/50 rounded space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {m.type === 'image' ? <Image size={14} /> : <Video size={14} />}
                    <span className="text-sm font-medium">Media {i + 1}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeMedia(m.id)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <select 
                    value={m.type} 
                    onChange={e => updateMedia(m.id, 'type', e.target.value)}
                    className="h-10 px-3 rounded border border-input bg-background text-sm"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                  <Input value={m.url} onChange={e => updateMedia(m.id, 'url', e.target.value)} placeholder="URL" className="flex-1" />
                </div>
                <Input value={m.caption} onChange={e => updateMedia(m.id, 'caption', e.target.value)} placeholder="Caption (required)" />
              </div>
            ))}
            {media.length < 3 && (
              <Button variant="outline" size="sm" onClick={addMedia}>
                <Plus size={14} className="mr-2" /> Add Media
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Related Projects */}
      <div className="border border-border rounded-lg p-4 space-y-4">
        <h2 className="font-semibold">Related Projects</h2>
        <div>
          <label className="text-sm text-muted-foreground">Slugs (comma separated)</label>
          <Input 
            value={relatedSlugs} 
            onChange={e => setRelatedSlugs(e.target.value)} 
            placeholder="project-1, project-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Available: {allProjects.filter(p => p.id !== data.id).map(p => p.slug).join(', ') || 'none'}
          </p>
        </div>
      </div>
    </div>
  );
}
