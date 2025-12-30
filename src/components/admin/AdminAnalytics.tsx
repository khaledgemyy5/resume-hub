import { useEffect, useState } from 'react';
import { dataClient } from '@/data';
import type { AnalyticsSummary } from '@/data/types';
import { Card } from '@/components/ui-kit';
import { BarChart3, Eye, Download, Mail, BookOpen, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui-kit';

export function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await dataClient.adminGetAnalytics(30);
      setAnalytics(data);
    } catch (err) {
      setError('Failed to load analytics');
      console.error(err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">View your site traffic and engagement</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="h-16 bg-muted rounded" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">View your site traffic and engagement</p>
        </div>
        <div className="border border-destructive/50 bg-destructive/10 rounded-lg p-4 text-destructive">
          {error}
        </div>
      </div>
    );
  }

  const hasData = analytics && (
    analytics.totalViews > 0 ||
    analytics.resumeDownloads > 0 ||
    analytics.contactClicks > 0 ||
    analytics.writingClicks > 0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Last 30 days • Events stored locally in mock mode</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadAnalytics}>
          <RefreshCw size={14} className="mr-2" /> Refresh
        </Button>
      </div>

      {!hasData ? (
        <div className="border border-border rounded-lg p-8 text-center">
          <BarChart3 size={48} className="mx-auto text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold mb-2">No Events Yet</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Browse your site to generate events. Page views, project views, resume downloads, 
            and contact clicks will appear here.
          </p>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded">
                  <Eye size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{analytics?.totalViews ?? 0}</div>
                  <div className="text-sm text-muted-foreground">Page Views</div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded">
                  <Download size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{analytics?.resumeDownloads ?? 0}</div>
                  <div className="text-sm text-muted-foreground">Resume Downloads</div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{analytics?.contactClicks ?? 0}</div>
                  <div className="text-sm text-muted-foreground">Contact Clicks</div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded">
                  <BookOpen size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{analytics?.writingClicks ?? 0}</div>
                  <div className="text-sm text-muted-foreground">Writing Clicks</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Top Projects */}
          <div className="border border-border rounded-lg p-4">
            <h2 className="font-semibold mb-4">Top Projects</h2>
            {analytics?.topProjects && analytics.topProjects.length > 0 ? (
              <div className="space-y-3">
                {analytics.topProjects.map((project, idx) => (
                  <div key={project.slug} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground text-sm w-6">#{idx + 1}</span>
                      <span className="font-medium">{project.title}</span>
                      <span className="text-xs text-muted-foreground">/{project.slug}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{project.views} views</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No project views yet</p>
            )}
          </div>

          {/* Info */}
          <div className="text-xs text-muted-foreground">
            <p>Events are tracked without PII. In mock mode, data is stored in localStorage.</p>
          </div>
        </>
      )}
    </div>
  );
}