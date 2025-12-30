import { useEffect, useState } from 'react';
import { dataClient } from '@/data';
import type { WritingData } from '@/data/types';
import { Seo } from '@/components/seo';
import { ExternalLink } from 'lucide-react';

export default function WritingPage() {
  const [writingData, setWritingData] = useState<WritingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showWhyMatters, setShowWhyMatters] = useState<Record<string, boolean>>({});

  useEffect(() => {
    dataClient.getWritingData().then((data) => {
      setWritingData(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="container-prose py-16">
        <p className="text-muted-foreground animate-pulse">Loading...</p>
      </div>
    );
  }

  const enabledCategories = writingData?.categories
    .filter((cat) => cat.enabled && cat.items.some((item) => item.enabled))
    .sort((a, b) => a.order - b.order) ?? [];

  const pageTitle = writingData?.settings?.pageTitle || 'Selected Writing';
  const pageIntro = writingData?.settings?.pageIntro || 'Articles, essays, and notes.';

  const toggleWhyMatters = (id: string) => {
    setShowWhyMatters(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <Seo title={pageTitle} description={pageIntro} />
      <div className="container-prose py-16 md:py-24">
        <h1 className="mb-2">{pageTitle}</h1>
        <p className="text-muted-foreground mb-12">{pageIntro}</p>

        {enabledCategories.length === 0 ? (
          <p className="text-muted-foreground">No writing yet.</p>
        ) : (
          <div className="space-y-12">
            {enabledCategories.map((category) => (
              <section key={category.id}>
                <h2 className="text-lg font-semibold mb-4 text-muted-foreground uppercase tracking-wide">
                  {category.name}
                </h2>
                
                <div className="space-y-1">
                  {category.items
                    .filter((item) => item.enabled)
                    .sort((a, b) => a.order - b.order)
                    .map((item) => (
                      <div key={item.id}>
                        <div className="group flex items-center justify-between py-3 border-b border-border">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <a
                              href={item.externalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium hover:text-muted-foreground transition-colors flex items-center gap-2"
                            >
                              {item.title}
                              <ExternalLink size={14} className="text-muted-foreground" />
                            </a>
                            {item.platform && (
                              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                {item.platform}
                              </span>
                            )}
                          </div>
                          {item.whyThisMatters && (
                            <button
                              onClick={() => toggleWhyMatters(item.id)}
                              className="text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0 ml-2"
                            >
                              {showWhyMatters[item.id] ? 'Hide' : 'Why this matters'}
                            </button>
                          )}
                        </div>
                        {item.whyThisMatters && showWhyMatters[item.id] && (
                          <p className="text-sm text-muted-foreground py-2 pl-4 border-l-2 border-muted ml-2">
                            {item.whyThisMatters}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
