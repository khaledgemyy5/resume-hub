import { useEffect, useState } from 'react';
import { dataClient } from '@/data';
import type { WritingData } from '@/data/types';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function WritingPage() {
  const [writingData, setWritingData] = useState<WritingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const publishedCategories = writingData?.categories.filter(
    (cat) => cat.items.some((item) => item.published)
  ) ?? [];

  return (
    <div className="container-prose py-16 md:py-24">
      <h1 className="mb-2">Writing</h1>
      <p className="text-muted-foreground mb-12">
        Thoughts, notes, and essays.
      </p>

      {publishedCategories.length === 0 ? (
        <p className="text-muted-foreground">No published writing yet.</p>
      ) : (
        <div className="space-y-12">
          {publishedCategories.map((category) => (
            <section key={category.id}>
              <h2 className="text-lg font-semibold mb-4 text-muted-foreground uppercase tracking-wide">
                {category.name}
              </h2>
              
              <div className="space-y-4">
                {category.items
                  .filter((item) => item.published)
                  .sort((a, b) => a.order - b.order)
                  .map((item) => (
                    <article key={item.id} className="group">
                      <Link 
                        to={`/writing/${category.slug}/${item.slug}`} 
                        className="flex items-center justify-between py-2 border-b border-border hover:border-foreground transition-colors"
                      >
                        <div>
                          <h3 className="font-medium">{item.title}</h3>
                          {item.excerpt && (
                            <p className="text-sm text-muted-foreground mt-1">{item.excerpt}</p>
                          )}
                        </div>
                        <ArrowRight size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                      </Link>
                    </article>
                  ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
