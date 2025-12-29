import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dataClient } from '@/data';
import type { Project } from '@/data/types';
import { Badge } from '@/components/ui-kit';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      dataClient.getProjectBySlug(slug).then((data) => {
        setProject(data);
        setIsLoading(false);
      });
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="container-prose py-16">
        <p className="text-muted-foreground animate-pulse">Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container-prose py-16">
        <h1 className="mb-4">Project Not Found</h1>
        <Link to="/projects" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Projects
        </Link>
      </div>
    );
  }

  const content = project.content[0];

  return (
    <div className="container-prose py-16 md:py-24">
      {/* Back link */}
      <Link 
        to="/projects" 
        className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 mb-8"
      >
        <ArrowLeft size={14} /> All Projects
      </Link>

      {/* Header */}
      <header className="mb-8">
        <h1 className="mb-3">{project.title}</h1>
        
        {content?.headline && (
          <p className="text-xl text-muted-foreground">{content.headline}</p>
        )}
        
        <div className="flex flex-wrap items-center gap-2 mt-4">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>

        {project.externalUrl && (
          <a
            href={project.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mt-4 transition-colors"
          >
            View Live <ExternalLink size={14} />
          </a>
        )}
      </header>

      {/* Content */}
      {content && (
        <section className="prose prose-neutral dark:prose-invert max-w-none">
          <div className="text-foreground leading-relaxed whitespace-pre-wrap">
            {content.body}
          </div>
        </section>
      )}
    </div>
  );
}
