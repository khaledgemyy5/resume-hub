import { Card } from '@/components/ui-kit';
import { BarChart3, TrendingUp, Users, Eye, ExternalLink } from 'lucide-react';

export function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">View your site traffic and engagement</p>
      </div>

      {/* Coming Soon Notice */}
      <div className="border border-border rounded-lg p-8 text-center">
        <BarChart3 size={48} className="mx-auto text-muted-foreground mb-4" />
        <h2 className="text-lg font-semibold mb-2">Analytics Coming Soon</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Track page views, project engagement, and external link clicks. 
          Analytics data will be stored locally in mock mode.
        </p>
      </div>

      {/* Placeholder Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 opacity-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded">
              <Eye size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold">-</div>
              <div className="text-sm text-muted-foreground">Page Views</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 opacity-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded">
              <Users size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold">-</div>
              <div className="text-sm text-muted-foreground">Visitors</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 opacity-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded">
              <TrendingUp size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold">-</div>
              <div className="text-sm text-muted-foreground">Avg. Time</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 opacity-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded">
              <ExternalLink size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold">-</div>
              <div className="text-sm text-muted-foreground">Ext. Clicks</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Planned Features */}
      <div className="border border-border rounded-lg p-4">
        <h2 className="font-semibold mb-3">Planned Features</h2>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li>• Page view tracking with referrer data</li>
          <li>• Project view counts and engagement</li>
          <li>• External link click tracking</li>
          <li>• Contact form submission tracking</li>
          <li>• Time-based analytics (daily/weekly/monthly)</li>
          <li>• Top pages and content reports</li>
        </ul>
      </div>
    </div>
  );
}
