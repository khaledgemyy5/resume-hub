import { Link } from 'react-router-dom';
import { useState } from 'react';
import { AdminWriting } from '@/components/admin';
import { ArrowLeft, Settings, FolderOpen, PenLine, BarChart3 } from 'lucide-react';

type Tab = 'settings' | 'projects' | 'writing' | 'analytics';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('writing');

  const tabs = [
    { id: 'settings' as Tab, label: 'Settings', icon: Settings },
    { id: 'projects' as Tab, label: 'Projects', icon: FolderOpen },
    { id: 'writing' as Tab, label: 'Writing', icon: PenLine },
    { id: 'analytics' as Tab, label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container-wide flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={14} /> Back to site
            </Link>
            <span className="text-lg font-semibold">Admin</span>
          </div>
        </div>
      </header>

      <div className="container-wide py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <nav className="md:w-48 shrink-0">
            <div className="flex md:flex-col gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                    activeTab === tab.id 
                      ? 'bg-muted text-foreground font-medium' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Content */}
          <main className="flex-1 min-w-0">
            {activeTab === 'settings' && (
              <div className="text-muted-foreground">
                Settings panel coming soon.
              </div>
            )}
            {activeTab === 'projects' && (
              <div className="text-muted-foreground">
                Projects panel coming soon.
              </div>
            )}
            {activeTab === 'writing' && <AdminWriting />}
            {activeTab === 'analytics' && (
              <div className="text-muted-foreground">
                Analytics panel coming soon.
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
