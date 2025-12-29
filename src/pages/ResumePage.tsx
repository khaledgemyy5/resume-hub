import { useSettings } from '@/contexts/SettingsContext';

export default function ResumePage() {
  const { settings } = useSettings();

  return (
    <div className="container-prose py-16 md:py-24">
      <h1 className="mb-2">Resume</h1>
      <p className="text-muted-foreground mb-12">
        Professional experience and background.
      </p>

      {/* Experience Section */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold mb-6 text-muted-foreground uppercase tracking-wide">
          Experience
        </h2>
        
        <div className="space-y-8">
          <article className="border-l-2 border-border pl-4">
            <h3 className="font-semibold">Senior Developer</h3>
            <p className="text-sm text-muted-foreground mb-2">Company Name · 2022 – Present</p>
            <p className="text-muted-foreground">
              Description of responsibilities and achievements.
            </p>
          </article>

          <article className="border-l-2 border-border pl-4">
            <h3 className="font-semibold">Developer</h3>
            <p className="text-sm text-muted-foreground mb-2">Previous Company · 2019 – 2022</p>
            <p className="text-muted-foreground">
              Description of responsibilities and achievements.
            </p>
          </article>
        </div>
      </section>

      {/* Skills Section */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold mb-6 text-muted-foreground uppercase tracking-wide">
          Skills
        </h2>
        
        <div className="flex flex-wrap gap-2">
          {['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS'].map((skill) => (
            <span key={skill} className="px-3 py-1 text-sm border border-border rounded">
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Education Section */}
      <section>
        <h2 className="text-lg font-semibold mb-6 text-muted-foreground uppercase tracking-wide">
          Education
        </h2>
        
        <article className="border-l-2 border-border pl-4">
          <h3 className="font-semibold">Bachelor's in Computer Science</h3>
          <p className="text-sm text-muted-foreground">University Name · 2015 – 2019</p>
        </article>
      </section>
    </div>
  );
}
