import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dataClient } from '@/data';
import type { Project, ProjectContent, ProjectMedia } from '@/data/types';
import { Badge } from '@/components/ui-kit';
import { ArrowLeft, ExternalLink, AlertTriangle } from 'lucide-react';

interface SectionProps {
  title: string;
  content?: string;
}

function Section({ title, content }: SectionProps) {
  if (!content) return null;
  return (
    <div className="mb-10">
      <h2 className="text-lg font-semibold mb-3 text-foreground">{title}</h2>
      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{content}</p>
    </div>
  );
}

function MediaItem({ item }: { item: ProjectMedia }) {
  const [loaded, setLoaded] = useState(false);

  if (item.type === 'video') {
    return (
      <figure className="mb-6">
        <div className="aspect-video bg-muted rounded-lg overflow-hidden">
          <iframe
            src={item.url}
            title={item.caption}
            className="w-full h-full"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
        <figcaption className="text-sm text-muted-foreground mt-2 text-center">
          {item.caption}
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className="mb-6">
      <div className="bg-muted rounded-lg overflow-hidden">
        {!loaded && (
          <div className="aspect-video animate-pulse bg-muted" />
        )}
        <img
          src={item.url}
          alt={item.caption}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`w-full h-auto ${loaded ? 'block' : 'hidden'}`}
        />
      </div>
      <figcaption className="text-sm text-muted-foreground mt-2 text-center">
        {item.caption}
      </figcaption>
    </figure>
  );
}

function DecisionLog({ decisions }: { decisions: NonNullable<ProjectContent['decisions']> }) {
  return (
    <div className="mb-10">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Decision Log</h2>
      <div className="space-y-4">
        {decisions.map((d) => (
          <div key={d.id} className="border border-border rounded-lg p-4">
            <div className="grid gap-2 text-sm">
              <div>
                <span className="font-medium text-foreground">Decision:</span>{' '}
                <span className="text-muted-foreground">{d.decision}</span>
              </div>
              <div>
                <span className="font-medium text-foreground">Trade-off:</span>{' '}
                <span className="text-muted-foreground">{d.tradeoff}</span>
              </div>
              <div>
                <span className="font-medium text-foreground">Outcome:</span>{' '}
                <span className="text-muted-foreground">{d.outcome}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricsMindset({ metrics }: { metrics: NonNullable<ProjectContent['metrics']> }) {
  return (
    <div className="mb-10">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Metrics Mindset</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="text-center p-4 border border-border rounded-lg">
            <div className="text-2xl font-bold text-foreground">{m.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RelatedProjects({ slugs, currentSlug }: { slugs: string[]; currentSlug: string }) {
  const [related, setRelated] = useState<Project[]>([]);

  useEffect(() => {
    Promise.all(slugs.filter(s => s !== currentSlug).map(slug => dataClient.getProjectBySlug(slug)))
      .then(projects => setRelated(projects.filter((p): p is Project => p !== null)));
  }, [slugs, currentSlug]);

  if (related.length === 0) return null;

  return (
    <div className="mt-16 pt-8 border-t border-border">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Related Projects</h2>
      <div className="space-y-3">
        {related.map((p) => (
          <Link
            key={p.id}
            to={`/projects/${p.slug}`}
            className="block p-4 border border-border rounded-lg hover:border-foreground/30 transition-colors"
          >
            <div className="font-medium text-foreground">{p.title}</div>
            {p.content[0]?.headline && (
              <div className="text-sm text-muted-foreground mt-1">{p.content[0].headline}</div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

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
  const sections = content?.sections;
  const media = content?.media?.slice(0, 3).sort((a, b) => a.order - b.order);

  return (
    <div className="container-prose py-16 md:py-24">
      {/* Back link */}
      <Link 
        to="/projects" 
        className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 mb-8"
      >
        <ArrowLeft size={14} /> All Projects
      </Link>

      {/* Confidential Banner */}
      {project.status === 'CONFIDENTIAL' && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 border border-border rounded-lg px-4 py-3 mb-8">
          <AlertTriangle size={16} />
          <span>Details intentionally limited due to confidentiality.</span>
        </div>
      )}

      {/* Header */}
      <header className="mb-12">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h1 className="text-3xl font-bold">{project.title}</h1>
          <div className="flex items-center gap-2 shrink-0">
            {project.status === 'CONFIDENTIAL' && (
              <Badge variant="outline">Confidential</Badge>
            )}
          </div>
        </div>
        
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

      {/* Main Sections */}
      {sections && (
        <div>
          <Section title="Overview" content={sections.overview} />
          <Section title="Context" content={sections.context} />
          <Section title="Problem" content={sections.problem} />
          <Section title="Your Role" content={sections.role} />
          <Section title="Constraints" content={sections.constraints} />
          <Section title="Approach & Decisions" content={sections.approach} />
          <Section title="Execution" content={sections.execution} />
          <Section title="Impact" content={sections.impact} />
          <Section title="Learnings" content={sections.learnings} />
          <Section title="Links" content={sections.links} />
        </div>
      )}

      {/* Decision Log */}
      {content?.decisions && content.decisions.length > 0 && (
        <DecisionLog decisions={content.decisions} />
      )}

      {/* Metrics Mindset */}
      {content?.metrics && content.metrics.length > 0 && (
        <MetricsMindset metrics={content.metrics} />
      )}

      {/* Media */}
      {media && media.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Media</h2>
          {media.map((item) => (
            <MediaItem key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Related Projects */}
      {project.relatedProjectSlugs && project.relatedProjectSlugs.length > 0 && (
        <RelatedProjects slugs={project.relatedProjectSlugs} currentSlug={project.slug} />
      )}
    </div>
  );
}
