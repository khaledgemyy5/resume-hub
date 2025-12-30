import { useEffect, useState } from 'react';
import { dataClient } from '@/data';
import type { SiteSettings, Project, WritingData } from '@/data/types';
import { Card } from '@/components/ui-kit';
import { FolderOpen, PenLine, Eye, Settings } from 'lucide-react';

export function AdminOverview() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [writing, setWriting] = useState<WritingData | null>(null);

  useEffect(() => {
    Promise.all([
      dataClient.adminGetSettings(),
      dataClient.adminGetProjects(),
      dataClient.getWritingData(),
    ]).then(([s, p, w]) => {
      setSettings(s);
      setProjects(p);
      setWriting(w);
    });
  }, []);

  const publicProjects = projects.filter(p => p.status === 'PUBLIC').length;
  const featuredProjects = projects.filter(p => p.featured).length;
  const totalItems = writing?.categories.reduce((acc, c) => acc + c.items.filter(i => i.enabled).length, 0) ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back{settings?.ownerName ? `, ${settings.ownerName}` : ''}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded">
              <FolderOpen size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold">{projects.length}</div>
              <div className="text-sm text-muted-foreground">Projects</div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            {publicProjects} public · {featuredProjects} featured
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded">
              <PenLine size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold">{totalItems}</div>
              <div className="text-sm text-muted-foreground">Writing Items</div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            {writing?.categories.length ?? 0} categories
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded">
              <Eye size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold">-</div>
              <div className="text-sm text-muted-foreground">Page Views</div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Analytics coming soon
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded">
              <Settings size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold truncate max-w-[120px]">
                {settings?.siteName || '-'}
              </div>
              <div className="text-sm text-muted-foreground">Site Name</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="font-semibold mb-3">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <a href="/admin#projects" className="p-4 border border-border rounded hover:border-foreground/30 transition-colors">
            <div className="font-medium">Add Project</div>
            <div className="text-sm text-muted-foreground">Create a new portfolio project</div>
          </a>
          <a href="/admin#writing" className="p-4 border border-border rounded hover:border-foreground/30 transition-colors">
            <div className="font-medium">Add Writing</div>
            <div className="text-sm text-muted-foreground">Add a new article or talk</div>
          </a>
          <a href="/" target="_blank" className="p-4 border border-border rounded hover:border-foreground/30 transition-colors">
            <div className="font-medium">View Site</div>
            <div className="text-sm text-muted-foreground">Preview your portfolio</div>
          </a>
        </div>
      </div>
    </div>
  );
}
