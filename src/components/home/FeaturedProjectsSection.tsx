import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { dataClient } from '@/data';
import { Badge } from '@/components/ui-kit';
import type { HomeLayoutSection, Project } from '@/data/types';

interface FeaturedProjectsSectionProps {
  section: HomeLayoutSection;
}

export function FeaturedProjectsSection({ section }: FeaturedProjectsSectionProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const allProjects = await dataClient.getPublishedProjects();
        const featured = allProjects
          .filter(p => p.featured)
          .sort((a, b) => a.order - b.order)
          .slice(0, 3);
        setProjects(featured);
      } catch (error) {
        console.error('Failed to load projects:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProjects();
  }, []);

  if (isLoading) {
    return (
      <section className="mb-16 md:mb-24">
        <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-6">
          {section.titleOverride || 'Featured Projects'}
        </h2>
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </section>
    );
  }

  if (projects.length === 0) return null;

  return (
    <section className="mb-16 md:mb-24">
      <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-6">
        {section.titleOverride || 'Featured Projects'}
      </h2>
      <div className="space-y-4">
        {projects.map(project => {
          const content = project.content[0];
          const headline = content?.headline || project.title;
          
          return (
            <Link 
              key={project.id}
              to={`/projects/${project.slug}`}
              className="group block p-4 -mx-4 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium truncate">{project.title}</h3>
                    <Badge variant={project.status === 'CONFIDENTIAL' ? 'secondary' : 'default'}>
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground line-clamp-1">{headline}</p>
                  {project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.tags.slice(0, 4).map(tag => (
                        <span key={tag} className="text-xs text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <ArrowRight 
                  size={16} 
                  className="shrink-0 text-muted-foreground group-hover:translate-x-1 transition-transform mt-1" 
                />
              </div>
            </Link>
          );
        })}
      </div>
      <Link 
        to="/projects"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mt-4"
      >
        <span>View all projects</span>
        <ArrowRight size={14} />
      </Link>
    </section>
  );
}
