import type {
  DataClient,
  SiteSettings,
  HomeLayout,
  HomeLayoutSection,
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
      { id: 'nav-writing', label: 'Writing', href: '/writing', enabled: false, order: 2 },
      { id: 'nav-contact', label: 'Contact', href: '/contact', enabled: true, order: 3 },
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
      { id: 'section-hero', type: 'hero', enabled: true, order: 0 },
      { id: 'section-experience', type: 'experience', enabled: true, order: 1 },
      { id: 'section-featured', type: 'featuredProjects', enabled: true, order: 2 },
      { id: 'section-skills', type: 'skills', enabled: false, order: 3 },
      { id: 'section-writing', type: 'writing', enabled: false, order: 4 },
      { id: 'section-cta', type: 'contactCta', enabled: true, order: 5 },
    ],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function createDemoProjects(): Project[] {
  const timestamp = now();
  const id1 = generateId();
  const id2 = generateId();
  return [
    {
      id: id1,
      slug: 'portfolio-site',
      title: 'Personal Portfolio Website',
      status: 'PUBLIC',
      featured: true,
      tags: ['React', 'TypeScript', 'Tailwind'],
      order: 0,
      content: [{
        id: generateId(),
        projectId: id1,
        detailLevel: 'STANDARD',
        headline: 'A minimalist portfolio built with modern web technologies',
        summary: 'Designed and developed a personal portfolio to showcase projects and experience.',
        body: '## Overview\n\nThis portfolio site was built with a focus on performance, accessibility, and clean design.',
        createdAt: timestamp,
        updatedAt: timestamp,
      }],
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: id2,
      slug: 'internal-tool',
      title: 'Enterprise Dashboard (Confidential)',
      status: 'CONFIDENTIAL',
      featured: false,
      tags: ['React', 'Node.js', 'PostgreSQL'],
      order: 1,
      content: [{
        id: generateId(),
        projectId: id2,
        detailLevel: 'BRIEF',
        headline: 'Internal analytics dashboard for enterprise client',
        summary: 'Built a comprehensive analytics dashboard handling millions of data points.',
        body: '## Note\n\nThis project is confidential. General details only.',
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

  async getProjectBySlug(slug: string): Promise<Project | null> {
    const projects = getFromStorage<Project[]>(KEYS.projects) || [];
    return projects.find((p) => p.slug === slug) || null;
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
    const updated = { ...current, ...data, updatedAt: now() };
    setToStorage(KEYS.settings, updated);
    return updated;
  }

  async adminGetHomeLayout(): Promise<HomeLayout> { return this.getHomeLayout(); }

  async adminUpdateHomeLayout(data: HomeLayoutInput): Promise<HomeLayout> {
    const current = await this.adminGetHomeLayout();
    const updated = { ...current, sections: data.sections, updatedAt: now() };
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
    const project: Project = { id: generateId(), ...data, content: [], createdAt: timestamp, updatedAt: timestamp };
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
    const content: ProjectContent = { id: generateId(), ...data, createdAt: timestamp, updatedAt: timestamp };
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
    const category: WritingCategory = { id: generateId(), ...data, items: [], createdAt: timestamp, updatedAt: timestamp };
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
    const item: WritingItem = { id: generateId(), ...data, createdAt: timestamp, updatedAt: timestamp };
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