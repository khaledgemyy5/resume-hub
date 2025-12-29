import { FileText, Folder, Server, Database, Shield, Zap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold tracking-tight">ammar-resume</h1>
          <p className="mt-2 text-muted-foreground">
            Monorepo scaffold • React + Express + PostgreSQL
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Project Structure */}
        <section>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Folder className="w-5 h-5" />
            Project Structure
          </h2>
          <div className="font-mono text-sm bg-muted/50 rounded-lg p-6 border border-border">
            <pre className="text-foreground/90">{`ammar-resume/
├── apps/
│   ├── web/          # React + Vite + TypeScript
│   └── api/          # Node.js + Express + TypeScript
├── packages/
│   └── shared/       # Shared types, Zod schemas
├── infra/            # AWS Terraform + docs
├── docker-compose.yml
├── TODO.md           # Phased checklist
└── README.md`}</pre>
          </div>
        </section>

        {/* Tech Stack */}
        <section>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Server className="w-5 h-5" />
            Tech Stack
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Frontend", value: "React 18, Vite, TypeScript, Tailwind" },
              { label: "Backend", value: "Node.js, Express, TypeScript" },
              { label: "Database", value: "PostgreSQL 15" },
              { label: "Validation", value: "Zod (shared schemas)" },
              { label: "Testing", value: "Vitest (web + api)" },
              { label: "Deploy", value: "Docker, AWS (ECS/Lambda)" },
            ].map((item) => (
              <div
                key={item.label}
                className="p-4 rounded-lg border border-border bg-card"
              >
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  {item.label}
                </div>
                <div className="text-sm font-medium">{item.value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Key Features */}
        <section>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Design Principles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: Database,
                title: "No Vendor Lock-in",
                desc: "PostgreSQL, self-hosted infrastructure",
              },
              {
                icon: Shield,
                title: "Security First",
                desc: "Helmet, rate limiting, JWT auth, validation",
              },
              {
                icon: Zap,
                title: "Performance",
                desc: "Code-splitting, lazy loading, caching",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-4 rounded-lg border border-border bg-card"
              >
                <item.icon className="w-5 h-5 mb-3 text-muted-foreground" />
                <div className="font-medium mb-1">{item.title}</div>
                <div className="text-sm text-muted-foreground">{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Start */}
        <section>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Quick Start
          </h2>
          <div className="font-mono text-sm bg-muted/50 rounded-lg p-6 border border-border space-y-2">
            <div className="text-muted-foreground"># Clone and install</div>
            <div>pnpm install</div>
            <div className="text-muted-foreground mt-4"># Start PostgreSQL</div>
            <div>docker-compose up -d postgres</div>
            <div className="text-muted-foreground mt-4"># Run dev servers</div>
            <div>pnpm dev</div>
          </div>
        </section>

        {/* Status */}
        <section className="border-t border-border pt-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            Scaffolding complete • See TODO.md for implementation phases
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="max-w-4xl mx-auto px-6 py-6 text-sm text-muted-foreground">
          Minimalist • Text-first • No images • Git-based deployment
        </div>
      </footer>
    </div>
  );
};

export default Index;
