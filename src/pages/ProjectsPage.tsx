import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { dataClient } from '@/data';
import type { Project } from '@/data/types';
import { Badge } from '@/components/ui-kit';
import { Seo } from '@/components/seo';
import { ArrowRight } from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    dataClient.getVisibleProjects().then((data) => {
      setProjects(data);
      setIsLoading(false);
    });
  }, []);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach((p) => p.tags.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [projects]);

  // Sort: featured first, then by order
  const sortedProjects = useMemo(() => {
    return [...projects]
      .filter((p) => !selectedTag || p.tags.includes(selectedTag))
      .sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return a.order - b.order;
      });
  }, [projects, selectedTag]);

  if (isLoading) {
    return (
      <div className="container-prose py-16">
        <p className="text-muted-foreground animate-pulse">Loading projects...</p>
      </div>
    );
  }

  return (
    <>
      <Seo title="Projects" description="A selection of projects and work I've contributed to." />
      <div className="container-prose py-16 md:py-24">
        <h1 className="mb-2">Projects</h1>
        <p className="text-muted-foreground mb-8">
          A selection of work I've contributed to.
        </p>

      {/* Tag Filter */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-12">
          <button
            onClick={() => setSelectedTag(null)}
            className={`text-sm px-3 py-1 rounded-full border transition-colors ${
              !selectedTag
                ? 'bg-foreground text-background border-foreground'
                : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground'
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`text-sm px-3 py-1 rounded-full border transition-colors ${
                selectedTag === tag
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {sortedProjects.length === 0 ? (
        <p className="text-muted-foreground">
          {selectedTag ? `No projects with tag "${selectedTag}".` : 'No projects yet.'}
        </p>
      ) : (
        <div className="space-y-6">
          {sortedProjects.map((project) => (
            <article 
              key={project.id} 
              className="group border border-border rounded-lg p-6 hover:border-foreground/30 transition-colors"
            >
              <Link to={`/projects/${project.slug}`} className="block">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h2 className="text-lg font-semibold group-hover:text-muted-foreground transition-colors">
                    {project.title}
                  </h2>
                  <div className="flex items-center gap-2 shrink-0">
                    {project.featured && (
                      <Badge variant="default">Featured</Badge>
                    )}
                    {project.status === 'CONFIDENTIAL' && (
                      <Badge variant="outline">Confidential</Badge>
                    )}
                  </div>
                </div>
                
                {project.content[0] && (
                  <p className="text-muted-foreground text-sm line-clamp-1 mb-4">
                    {project.content[0].headline || project.content[0].summary}
                  </p>
                )}
                
                <div className="flex flex-wrap items-center gap-2">
                  {project.tags.slice(0, 4).map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                  {project.tags.length > 4 && (
                    <span className="text-xs text-muted-foreground">+{project.tags.length - 4}</span>
                  )}
                  
                  <span className="ml-auto text-sm text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-1">
                    View <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
      </div>
    </>
  );
}
