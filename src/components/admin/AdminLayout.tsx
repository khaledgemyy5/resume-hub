import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { 
  ArrowLeft, LayoutDashboard, Layout, FolderOpen, PenLine, 
  FileText, Palette, Search, BarChart3, Settings, LogOut,
  ChevronLeft, ChevronRight
} from 'lucide-react';

export type AdminTab = 
  | 'overview' 
  | 'home-layout' 
  | 'projects' 
  | 'writing' 
  | 'pages' 
  | 'theme' 
  | 'seo' 
  | 'analytics' 
  | 'settings';

interface AdminLayoutProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  children: React.ReactNode;
}

const tabs = [
  { id: 'overview' as AdminTab, label: 'Overview', icon: LayoutDashboard },
  { id: 'home-layout' as AdminTab, label: 'Home Layout', icon: Layout },
  { id: 'projects' as AdminTab, label: 'Projects', icon: FolderOpen },
  { id: 'writing' as AdminTab, label: 'Writing', icon: PenLine },
  { id: 'pages' as AdminTab, label: 'Pages', icon: FileText },
  { id: 'theme' as AdminTab, label: 'Theme', icon: Palette },
  { id: 'seo' as AdminTab, label: 'SEO', icon: Search },
  { id: 'analytics' as AdminTab, label: 'Analytics', icon: BarChart3 },
  { id: 'settings' as AdminTab, label: 'Settings', icon: Settings },
];

export function AdminLayout({ activeTab, onTabChange, children }: AdminLayoutProps) {
  const { user, logout } = useAdminAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`border-r border-border bg-muted/30 flex flex-col transition-all ${collapsed ? 'w-14' : 'w-56'}`}>
        {/* Logo */}
        <div className="h-14 border-b border-border flex items-center px-3 gap-2">
          {!collapsed && <span className="font-semibold">Admin</span>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto p-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${
                activeTab === tab.id 
                  ? 'bg-background text-foreground font-medium shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              }`}
              title={collapsed ? tab.label : undefined}
            >
              <tab.icon size={18} />
              {!collapsed && <span>{tab.label}</span>}
            </button>
          ))}
        </nav>

        {/* User & Logout */}
        <div className="border-t border-border p-3 space-y-2">
          {!collapsed && user && (
            <div className="text-xs text-muted-foreground truncate px-2">
              {user.email}
            </div>
          )}
          <div className="flex gap-2">
            <Link
              to="/"
              className={`flex items-center gap-2 px-3 py-2 rounded text-sm text-muted-foreground hover:text-foreground hover:bg-background/50 transition-colors ${collapsed ? 'justify-center' : ''}`}
              title="Back to site"
            >
              <ArrowLeft size={16} />
              {!collapsed && <span>Site</span>}
            </Link>
            <button
              onClick={logout}
              className={`flex items-center gap-2 px-3 py-2 rounded text-sm text-muted-foreground hover:text-foreground hover:bg-background/50 transition-colors ${collapsed ? 'justify-center' : ''}`}
              title="Logout"
            >
              <LogOut size={16} />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-5xl">
          {children}
        </div>
      </main>
    </div>
  );
}
