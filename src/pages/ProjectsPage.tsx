import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dataClient } from '@/data';
import type { Project } from '@/data/types';
import { Badge } from '@/components/ui-kit';
import { ArrowRight } from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dataClient.getPublishedProjects().then((data) => {
      setProjects(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="container-prose py-16">
        <p className="text-muted-foreground animate-pulse">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="container-prose py-16 md:py-24">
      <h1 className="mb-2">Projects</h1>
      <p className="text-muted-foreground mb-12">
        A selection of work I've contributed to.
      </p>

      {projects.length === 0 ? (
        <p className="text-muted-foreground">No projects yet.</p>
      ) : (
        <div className="space-y-8">
          {projects.map((project) => (
            <article key={project.id} className="group border-b border-border pb-8 last:border-0">
              <Link to={`/projects/${project.slug}`} className="block">
                <h2 className="text-xl font-semibold mb-2 group-hover:text-muted-foreground transition-colors">
                  {project.title}
                </h2>
                
                {project.content[0] && (
                  <p className="text-muted-foreground mb-3">
                    {project.content[0].summary}
                  </p>
                )}
                
                <div className="flex flex-wrap items-center gap-2">
                  {project.tags.slice(0, 4).map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                  
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
  );
}
