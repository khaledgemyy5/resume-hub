import type {
  DataClient,
  SiteSettings,
  HomeLayout,
  HomeLayoutSection,
  NavItem,
  Project,
  ProjectContent,
  WritingData,
  WritingCategory,
  WritingItem,
  AdminUser,
  AuthTokens,
  SiteSettingsInput,
  HomeLayoutInput,
  ProjectInput,
  ProjectContentInput,
  WritingCategoryInput,
  WritingItemInput,
  TrackEventInput,
} from './types';

const STORAGE_VERSION = 'v1';
const KEYS = {
  settings: `ammar_resume_${STORAGE_VERSION}_settings`,
  homeLayout: `ammar_resume_${STORAGE_VERSION}_home_layout`,
  projects: `ammar_resume_${STORAGE_VERSION}_projects`,
  writing: `ammar_resume_${STORAGE_VERSION}_writing`,
  events: `ammar_resume_${STORAGE_VERSION}_events`,
  adminUser: `ammar_resume_${STORAGE_VERSION}_admin_user`,
  adminToken: `ammar_resume_${STORAGE_VERSION}_admin_token`,
} as const;

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function now(): string {
  return new Date().toISOString();
}

function getFromStorage<T>(key: string): T | null {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function setToStorage<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

function createDefaultSettings(): SiteSettings {
  const timestamp = now();
  return {
    id: generateId(),
    siteName: 'Ammar Resume',
    siteDescription: 'A minimalist personal portfolio and resume site.',
    ownerName: 'Ammar',
    ownerEmail: 'hello@example.com',
    ownerTitle: 'Software Engineer',
    socialLinks: { github: 'https://github.com', linkedin: 'https://linkedin.com' },
    theme: {
      fontPrimary: 'system-ui, -apple-system, sans-serif',
      fontSecondary: 'Georgia, serif',
      colorBackground: '0 0% 100%',
      colorForeground: '0 0% 3.9%',
      colorPrimary: '0 0% 9%',
      colorAccent: '0 0% 45%',
      colorMuted: '0 0% 96%',
    },
    navigation: [
      { id: 'nav-home', label: 'Home', href: '/', enabled: true, order: 0 },
      { id: 'nav-projects', label: 'Projects', href: '/projects', enabled: true, order: 1 },
      { id: 'nav-resume', label: 'Resume', href: '/resume', enabled: true, order: 2 },
      { id: 'nav-writing', label: 'Writing', href: '/writing', enabled: false, order: 3 },
      { id: 'nav-contact', label: 'Contact', href: '/contact', enabled: true, order: 4 },
    ],
    seoDefaults: {
      title: 'Ammar | Software Engineer',
      description: 'A minimalist personal portfolio and resume site.',
    },
    faviconUrl: '/favicon.ico',
    resumePdfUrl: '/resume.pdf',
    calendarUrl: 'https://cal.com/ammar',
    resumeData: {
      experience: [
        { title: 'Senior Software Engineer', company: 'TechCorp', period: '2021 – Present', description: 'Leading frontend architecture and design system development for enterprise products.' },
        { title: 'Full Stack Developer', company: 'StartupXYZ', period: '2018 – 2021', description: 'Built and scaled a SaaS platform from 0 to 50k users.' },
        { title: 'Frontend Developer', company: 'Agency Co', period: '2016 – 2018', description: 'Developed responsive web applications for various clients.' },
      ],
      skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS', 'GraphQL', 'Tailwind CSS', 'Next.js'],
      education: [
        { degree: 'B.S. Computer Science', institution: 'University of Technology', period: '2012 – 2016' },
      ],
      certifications: ['AWS Solutions Architect', 'Google Cloud Professional'],
    },
    externalLinks: [
      { id: 'link-1', label: 'Blog', url: 'https://blog.example.com' },
      { id: 'link-2', label: 'Dribbble', url: 'https://dribbble.com/ammar' },
    ],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function createDefaultHomeLayout(): HomeLayout {
  const timestamp = now();
  return {
    id: generateId(),
    sections: [
      { id: 'section-hero', type: 'hero', enabled: true, order: 0, config: {
        name: 'Ammar',
        title: 'Software Engineer',
        valueProp: 'I build elegant, high-performance web applications with a focus on user experience and clean architecture.',
      }},
      { id: 'section-experience', type: 'experience', enabled: true, order: 1, config: {
        items: [
          { company: 'TechCorp', role: 'Senior Engineer', years: '2021 – Present' },
          { company: 'StartupXYZ', role: 'Full Stack Developer', years: '2018 – 2021' },
          { company: 'Agency Co', role: 'Frontend Developer', years: '2016 – 2018' },
        ]
      }},
      { id: 'section-featured', type: 'featuredProjects', enabled: true, order: 2 },
      { id: 'section-how-i-work', type: 'howIWork', enabled: false, order: 3, config: {
        items: [
          'Start with user needs, not technical solutions',
          'Iterate quickly with continuous feedback',
          'Write code that reads like documentation',
          'Automate everything that can be automated',
          'Ship early, measure, improve',
        ]
      }},
      { id: 'section-metrics', type: 'metrics', enabled: false, order: 4, config: {
        items: [
          { label: 'Performance Score', value: '98/100' },
          { label: 'Test Coverage', value: '85%' },
          { label: 'Deploy Frequency', value: 'Daily' },
        ]
      }},
      { id: 'section-availability', type: 'availability', enabled: false, order: 5, config: {
        openTo: ['Full-time roles', 'Advisory', 'Open source'],
        focusAreas: ['Frontend Architecture', 'Design Systems', 'Performance Optimization'],
      }},
      { id: 'section-writing', type: 'writing', enabled: false, order: 6 },
      { id: 'section-cta', type: 'contactCta', enabled: true, order: 7, config: {
        email: 'hello@example.com',
        linkedin: 'https://linkedin.com/in/ammar',
        calendarUrl: '',
      }},
    ],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function createDemoProjects(): Project[] {
  const timestamp = now();
  const id1 = generateId();
  const id2 = generateId();
  const id3 = generateId();
  return [
    {
      id: id1,
      slug: 'portfolio-site',
      title: 'Personal Portfolio Website',
      status: 'PUBLIC',
      featured: true,
      tags: ['React', 'TypeScript', 'Tailwind', 'Performance'],
      order: 0,
      relatedProjectSlugs: ['design-system'],
      content: [{
        id: generateId(),
        projectId: id1,
        detailLevel: 'STANDARD',
        headline: 'A minimalist portfolio built with modern web technologies',
        summary: 'Designed and developed a personal portfolio to showcase projects and experience.',
        body: '',
        sections: {
          overview: 'A personal portfolio website focused on performance, accessibility, and clean design. Built to showcase projects and professional experience in a minimalist, text-first format.',
          context: 'As a developer, having a polished online presence is essential. Most portfolio templates were either too flashy or lacked the customization I needed.',
          problem: 'Needed a fast, accessible, and easily maintainable portfolio that could grow with my career while maintaining a consistent design language.',
          role: 'Sole developer and designer. Responsible for all aspects from conception to deployment.',
          approach: 'Started with a mobile-first design approach, focusing on typography and whitespace. Chose React + TypeScript for type safety and Tailwind for rapid styling. Implemented a modular component system for easy content updates.',
          execution: 'Built incrementally over 3 weeks. Started with core layout, then added project showcase, then resume section. Used GitHub Actions for CI/CD to Vercel.',
          impact: 'Site loads in under 1 second on 3G. Lighthouse score of 98+. Has generated multiple interview opportunities.',
          learnings: 'Simplicity wins. Resisted the urge to add animations and effects. Focused on content and readability instead.',
        },
        decisions: [
          { id: generateId(), decision: 'Use Tailwind CSS over styled-components', tradeoff: 'Less encapsulation but faster development', outcome: 'Reduced styling time by 50%' },
          { id: generateId(), decision: 'No images by default', tradeoff: 'Less visual appeal but faster loads', outcome: 'Perfect lighthouse performance score' },
        ],
        metrics: [
          { label: 'Lighthouse Performance', value: '98/100' },
          { label: 'Time to Interactive', value: '<1s' },
          { label: 'Bundle Size', value: '<100KB' },
        ],
        createdAt: timestamp,
        updatedAt: timestamp,
      }],
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: id2,
      slug: 'internal-tool',
      title: 'Enterprise Analytics Dashboard',
      status: 'CONFIDENTIAL',
      featured: false,
      tags: ['React', 'Node.js', 'PostgreSQL', 'Data Viz'],
      order: 1,
      content: [{
        id: generateId(),
        projectId: id2,
        detailLevel: 'BRIEF',
        headline: 'Internal analytics dashboard for enterprise client',
        summary: 'Built a comprehensive analytics dashboard handling millions of data points daily.',
        body: '',
        sections: {
          overview: 'A real-time analytics dashboard for a Fortune 500 company, processing and visualizing millions of data points daily.',
          role: 'Lead frontend developer in a team of 5. Architected the data visualization layer.',
          impact: 'Reduced report generation time from hours to seconds. Now used by 200+ analysts daily.',
        },
        createdAt: timestamp,
        updatedAt: timestamp,
      }],
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: id3,
      slug: 'design-system',
      title: 'Component Design System',
      status: 'PUBLIC',
      featured: true,
      tags: ['React', 'Storybook', 'Design Systems', 'TypeScript'],
      order: 2,
      relatedProjectSlugs: ['portfolio-site'],
      content: [{
        id: generateId(),
        projectId: id3,
        detailLevel: 'DEEP',
        headline: 'A scalable design system powering multiple products',
        summary: 'Created a comprehensive design system with 50+ components used across 4 products.',
        body: '',
        sections: {
          overview: 'A comprehensive design system built from the ground up, featuring 50+ components, detailed documentation, and a robust theming system.',
          context: 'The company had 4 products with inconsistent UIs. Each team was building their own components, leading to duplicated effort and poor user experience.',
          problem: 'Needed a unified component library that would work across all products while allowing for product-specific theming.',
          role: 'Design system lead. Worked with designers to establish patterns and with product teams to ensure adoption.',
          constraints: 'Had to support 3 different React versions across products. Needed to maintain backward compatibility.',
          approach: 'Started with an audit of existing components across all products. Identified common patterns and created a priority list. Built components incrementally, starting with primitives.',
          execution: 'Released in phases over 6 months. Each phase included migration guides and team training sessions.',
          impact: 'Reduced UI development time by 40%. Improved design consistency score from 60% to 95%. Now the foundation for all new products.',
          learnings: 'Documentation is as important as the code. Invested heavily in Storybook stories and usage guidelines.',
          links: 'Storybook: https://storybook.example.com',
        },
        decisions: [
          { id: generateId(), decision: 'Use composition over configuration', tradeoff: 'More verbose usage but more flexible', outcome: 'Teams could build custom variants easily' },
          { id: generateId(), decision: 'Ship unstyled primitives first', tradeoff: 'Teams had to style initially', outcome: 'Faster adoption, better long-term flexibility' },
          { id: generateId(), decision: 'Semantic versioning with changelogs', tradeoff: 'More release overhead', outcome: 'Zero breaking-change incidents post-adoption' },
        ],
        metrics: [
          { label: 'Components', value: '50+' },
          { label: 'Products Using', value: '4' },
          { label: 'Dev Time Saved', value: '40%' },
          { label: 'Consistency Score', value: '95%' },
        ],
        media: [
          { id: generateId(), type: 'image', url: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800', caption: 'Component architecture diagram', order: 0 },
        ],
        createdAt: timestamp,
        updatedAt: timestamp,
      }],
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];
}

export class MockDataClient implements DataClient {
  private initialized = false;

  constructor() {
    this.seedDefaults();
  }

  seedDefaults(): void {
    if (this.initialized) return;
    if (!getFromStorage(KEYS.settings)) setToStorage(KEYS.settings, createDefaultSettings());
    if (!getFromStorage(KEYS.homeLayout)) setToStorage(KEYS.homeLayout, createDefaultHomeLayout());
    if (!getFromStorage(KEYS.projects)) setToStorage(KEYS.projects, createDemoProjects());
    if (!getFromStorage(KEYS.writing)) setToStorage(KEYS.writing, { categories: [] });
    this.initialized = true;
  }

  async getPublicSettings(): Promise<SiteSettings> {
    return getFromStorage<SiteSettings>(KEYS.settings) || createDefaultSettings();
  }

  async getHomeLayout(): Promise<HomeLayout> {
    return getFromStorage<HomeLayout>(KEYS.homeLayout) || createDefaultHomeLayout();
  }

  async getPublishedProjects(): Promise<Project[]> {
    const projects = getFromStorage<Project[]>(KEYS.projects) || [];
    return projects.filter((p) => p.status === 'PUBLIC');
  }

  async getVisibleProjects(): Promise<Project[]> {
    const projects = getFromStorage<Project[]>(KEYS.projects) || [];
    return projects.filter((p) => p.status !== 'CONCEPT');
  }

  async getProjectBySlug(slug: string): Promise<Project | null> {
    const projects = getFromStorage<Project[]>(KEYS.projects) || [];
    const project = projects.find((p) => p.slug === slug);
    // Only return if it's visible (not a concept)
    if (project && project.status !== 'CONCEPT') return project;
    return null;
  }

  async getWritingData(): Promise<WritingData> {
    return getFromStorage<WritingData>(KEYS.writing) || { categories: [] };
  }

  async trackEvent(event: TrackEventInput): Promise<void> {
    const events = getFromStorage<unknown[]>(KEYS.events) || [];
    events.push({ id: generateId(), ...event, timestamp: now() });
    setToStorage(KEYS.events, events);
  }

  async adminLogin(email: string, password: string): Promise<AuthTokens> {
    if (email && password.length >= 8) {
      const tokens: AuthTokens = { accessToken: `mock_${generateId()}`, refreshToken: `mock_${generateId()}`, expiresIn: 3600 };
      const user: AdminUser = { id: generateId(), email, name: email.split('@')[0] };
      setToStorage(KEYS.adminToken, tokens);
      setToStorage(KEYS.adminUser, user);
      return tokens;
    }
    throw new Error('Invalid credentials');
  }

  async adminLogout(): Promise<void> {
    localStorage.removeItem(KEYS.adminToken);
    localStorage.removeItem(KEYS.adminUser);
  }

  async adminMe(): Promise<AdminUser | null> {
    return getFromStorage<AdminUser>(KEYS.adminUser);
  }

  async adminGetSettings(): Promise<SiteSettings> { return this.getPublicSettings(); }

  async adminUpdateSettings(data: SiteSettingsInput): Promise<SiteSettings> {
    const current = await this.adminGetSettings();
    const updated: SiteSettings = {
      ...current,
      ...(data.siteName !== undefined && { siteName: data.siteName }),
      ...(data.siteDescription !== undefined && { siteDescription: data.siteDescription }),
      ...(data.ownerName !== undefined && { ownerName: data.ownerName }),
      ...(data.ownerEmail !== undefined && { ownerEmail: data.ownerEmail }),
      ...(data.socialLinks !== undefined && { socialLinks: data.socialLinks }),
      ...(data.theme !== undefined && { theme: { ...current.theme, ...data.theme } }),
      ...(data.navigation !== undefined && { navigation: data.navigation as NavItem[] }),
      updatedAt: now(),
    };
    setToStorage(KEYS.settings, updated);
    return updated;
  }

  async adminGetHomeLayout(): Promise<HomeLayout> { return this.getHomeLayout(); }

  async adminUpdateHomeLayout(data: HomeLayoutInput): Promise<HomeLayout> {
    const current = await this.adminGetHomeLayout();
    const updated: HomeLayout = { 
      ...current, 
      sections: data.sections as HomeLayoutSection[], 
      updatedAt: now() 
    };
    setToStorage(KEYS.homeLayout, updated);
    return updated;
  }

  async adminGetProjects(): Promise<Project[]> { return getFromStorage<Project[]>(KEYS.projects) || []; }

  async adminGetProject(id: string): Promise<Project | null> {
    const projects = await this.adminGetProjects();
    return projects.find((p) => p.id === id) || null;
  }

  async adminCreateProject(data: ProjectInput): Promise<Project> {
    const timestamp = now();
    const project: Project = {
      id: generateId(),
      slug: data.slug,
      title: data.title,
      status: data.status,
      featured: data.featured,
      tags: data.tags,
      thumbnailUrl: data.thumbnailUrl,
      startDate: data.startDate,
      endDate: data.endDate,
      externalUrl: data.externalUrl,
      order: data.order,
      content: [],
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    const projects = await this.adminGetProjects();
    projects.push(project);
    setToStorage(KEYS.projects, projects);
    return project;
  }

  async adminUpdateProject(id: string, data: Partial<ProjectInput>): Promise<Project> {
    const projects = await this.adminGetProjects();
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Project not found');
    projects[index] = { ...projects[index], ...data, updatedAt: now() };
    setToStorage(KEYS.projects, projects);
    return projects[index];
  }

  async adminDeleteProject(id: string): Promise<void> {
    const projects = await this.adminGetProjects();
    setToStorage(KEYS.projects, projects.filter((p) => p.id !== id));
  }

  async adminCreateProjectContent(projectId: string, data: ProjectContentInput): Promise<ProjectContent> {
    const projects = await this.adminGetProjects();
    const index = projects.findIndex((p) => p.id === projectId);
    if (index === -1) throw new Error('Project not found');
    const timestamp = now();
    const content: ProjectContent = {
      id: generateId(),
      projectId: data.projectId,
      detailLevel: data.detailLevel,
      headline: data.headline,
      summary: data.summary,
      body: data.body,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    projects[index].content.push(content);
    projects[index].updatedAt = timestamp;
    setToStorage(KEYS.projects, projects);
    return content;
  }

  async adminUpdateProjectContent(id: string, data: Partial<ProjectContentInput>): Promise<ProjectContent> {
    const projects = await this.adminGetProjects();
    for (const project of projects) {
      const ci = project.content.findIndex((c) => c.id === id);
      if (ci !== -1) {
        project.content[ci] = { ...project.content[ci], ...data, updatedAt: now() };
        project.updatedAt = now();
        setToStorage(KEYS.projects, projects);
        return project.content[ci];
      }
    }
    throw new Error('Content not found');
  }

  async adminDeleteProjectContent(id: string): Promise<void> {
    const projects = await this.adminGetProjects();
    for (const project of projects) {
      const ci = project.content.findIndex((c) => c.id === id);
      if (ci !== -1) {
        project.content.splice(ci, 1);
        project.updatedAt = now();
        setToStorage(KEYS.projects, projects);
        return;
      }
    }
  }

  async adminGetWritingCategories(): Promise<WritingCategory[]> {
    const data = await this.getWritingData();
    return data.categories;
  }

  async adminGetWritingCategory(id: string): Promise<WritingCategory | null> {
    const cats = await this.adminGetWritingCategories();
    return cats.find((c) => c.id === id) || null;
  }

  async adminCreateWritingCategory(data: WritingCategoryInput): Promise<WritingCategory> {
    const writingData = await this.getWritingData();
    const timestamp = now();
    const category: WritingCategory = {
      id: generateId(),
      slug: data.slug,
      name: data.name,
      description: data.description,
      order: data.order,
      items: [],
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    writingData.categories.push(category);
    setToStorage(KEYS.writing, writingData);
    return category;
  }

  async adminUpdateWritingCategory(id: string, data: Partial<WritingCategoryInput>): Promise<WritingCategory> {
    const writingData = await this.getWritingData();
    const index = writingData.categories.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Category not found');
    writingData.categories[index] = { ...writingData.categories[index], ...data, updatedAt: now() };
    setToStorage(KEYS.writing, writingData);
    return writingData.categories[index];
  }

  async adminDeleteWritingCategory(id: string): Promise<void> {
    const writingData = await this.getWritingData();
    writingData.categories = writingData.categories.filter((c) => c.id !== id);
    setToStorage(KEYS.writing, writingData);
  }

  async adminCreateWritingItem(categoryId: string, data: WritingItemInput): Promise<WritingItem> {
    const writingData = await this.getWritingData();
    const catIndex = writingData.categories.findIndex((c) => c.id === categoryId);
    if (catIndex === -1) throw new Error('Category not found');
    const timestamp = now();
    const item: WritingItem = {
      id: generateId(),
      categoryId: data.categoryId,
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt,
      body: data.body,
      published: data.published,
      publishedAt: data.publishedAt,
      order: data.order,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    writingData.categories[catIndex].items.push(item);
    writingData.categories[catIndex].updatedAt = timestamp;
    setToStorage(KEYS.writing, writingData);
    return item;
  }

  async adminUpdateWritingItem(id: string, data: Partial<WritingItemInput>): Promise<WritingItem> {
    const writingData = await this.getWritingData();
    for (const cat of writingData.categories) {
      const ii = cat.items.findIndex((i) => i.id === id);
      if (ii !== -1) {
        cat.items[ii] = { ...cat.items[ii], ...data, updatedAt: now() };
        cat.updatedAt = now();
        setToStorage(KEYS.writing, writingData);
        return cat.items[ii];
      }
    }
    throw new Error('Item not found');
  }

  async adminDeleteWritingItem(id: string): Promise<void> {
    const writingData = await this.getWritingData();
    for (const cat of writingData.categories) {
      const ii = cat.items.findIndex((i) => i.id === id);
      if (ii !== -1) {
        cat.items.splice(ii, 1);
        cat.updatedAt = now();
        setToStorage(KEYS.writing, writingData);
        return;
      }
    }
  }
}