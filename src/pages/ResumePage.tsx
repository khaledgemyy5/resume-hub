import { useRef } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Button } from '@/components/ui-kit';
import { Seo } from '@/components/seo';
import { Download, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function ResumePage() {
  const { settings } = useSettings();
  const resumeRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const resumeData = settings?.resumeData;
  const ownerName = settings?.ownerName ?? 'Name';
  const ownerTitle = settings?.ownerTitle ?? 'Professional';
  const ownerEmail = settings?.ownerEmail ?? '';

  const handleCopyPlainText = async () => {
    if (!resumeRef.current) return;
    
    // Generate plain text version
    const lines: string[] = [];
    lines.push(ownerName.toUpperCase());
    lines.push(ownerTitle);
    if (ownerEmail) lines.push(ownerEmail);
    lines.push('');
    
    if (resumeData?.experience?.length) {
      lines.push('EXPERIENCE');
      lines.push('----------');
      resumeData.experience.forEach((exp) => {
        lines.push(`${exp.title} | ${exp.company} | ${exp.period}`);
        lines.push(exp.description);
        lines.push('');
      });
    }
    
    if (resumeData?.skills?.length) {
      lines.push('SKILLS');
      lines.push('------');
      lines.push(resumeData.skills.join(', '));
      lines.push('');
    }
    
    if (resumeData?.education?.length) {
      lines.push('EDUCATION');
      lines.push('---------');
      resumeData.education.forEach((edu) => {
        lines.push(`${edu.degree} | ${edu.institution} | ${edu.period}`);
      });
      lines.push('');
    }
    
    if (resumeData?.certifications?.length) {
      lines.push('CERTIFICATIONS');
      lines.push('--------------');
      lines.push(resumeData.certifications.join(', '));
    }
    
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleDownloadPdf = () => {
    if (settings?.resumePdfUrl) {
      window.open(settings.resumePdfUrl, '_blank');
    }
  };

  return (
    <>
      <Seo title="Resume" description={`Professional resume of ${ownerName}`} />
      
      <div className="container-prose py-16 md:py-24">
        {/* Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          {settings?.resumePdfUrl && (
            <Button variant="outline" size="sm" onClick={handleDownloadPdf}>
              <Download size={16} className="mr-2" />
              Download PDF
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleCopyPlainText}>
            {copied ? <Check size={16} className="mr-2" /> : <Copy size={16} className="mr-2" />}
            {copied ? 'Copied!' : 'Copy Plain Text'}
          </Button>
        </div>

        {/* ATS-Friendly Resume Content */}
        <div ref={resumeRef} className="space-y-10">
          {/* Header */}
          <header>
            <h1 className="text-3xl font-bold mb-1">{ownerName}</h1>
            <p className="text-xl text-muted-foreground mb-2">{ownerTitle}</p>
            {ownerEmail && (
              <a 
                href={`mailto:${ownerEmail}`} 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {ownerEmail}
              </a>
            )}
          </header>

          {/* Experience */}
          {resumeData?.experience && resumeData.experience.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-6 text-muted-foreground uppercase tracking-wide border-b border-border pb-2">
                Experience
              </h2>
              <div className="space-y-6">
                {resumeData.experience.map((exp, i) => (
                  <article key={i}>
                    <h3 className="font-semibold text-foreground">{exp.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {exp.company} · {exp.period}
                    </p>
                    <p className="text-muted-foreground">{exp.description}</p>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {resumeData?.skills && resumeData.skills.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4 text-muted-foreground uppercase tracking-wide border-b border-border pb-2">
                Skills
              </h2>
              <p className="text-muted-foreground">
                {resumeData.skills.join(' · ')}
              </p>
            </section>
          )}

          {/* Education */}
          {resumeData?.education && resumeData.education.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4 text-muted-foreground uppercase tracking-wide border-b border-border pb-2">
                Education
              </h2>
              <div className="space-y-4">
                {resumeData.education.map((edu, i) => (
                  <article key={i}>
                    <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                    <p className="text-sm text-muted-foreground">
                      {edu.institution} · {edu.period}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {resumeData?.certifications && resumeData.certifications.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4 text-muted-foreground uppercase tracking-wide border-b border-border pb-2">
                Certifications
              </h2>
              <p className="text-muted-foreground">
                {resumeData.certifications.join(' · ')}
              </p>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
