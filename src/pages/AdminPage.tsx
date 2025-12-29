import { Link } from 'react-router-dom';

export default function AdminPage() {
  return (
    <div className="container-prose py-16 md:py-24">
      <h1 className="mb-2">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-12">
        Manage your portfolio content.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="p-4 border border-border rounded hover:border-foreground transition-colors">
          <h3 className="font-semibold mb-1">Settings</h3>
          <p className="text-sm text-muted-foreground">Site name, theme, navigation</p>
        </div>
        
        <div className="p-4 border border-border rounded hover:border-foreground transition-colors">
          <h3 className="font-semibold mb-1">Projects</h3>
          <p className="text-sm text-muted-foreground">Manage portfolio projects</p>
        </div>
        
        <div className="p-4 border border-border rounded hover:border-foreground transition-colors">
          <h3 className="font-semibold mb-1">Writing</h3>
          <p className="text-sm text-muted-foreground">Blog posts and essays</p>
        </div>
        
        <div className="p-4 border border-border rounded hover:border-foreground transition-colors">
          <h3 className="font-semibold mb-1">Analytics</h3>
          <p className="text-sm text-muted-foreground">View site traffic</p>
        </div>
      </div>

      <div className="mt-8">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Back to site
        </Link>
      </div>
    </div>
  );
}
