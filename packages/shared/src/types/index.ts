// ============= Enums as String Literals =============

export type ProjectStatus = 'PUBLIC' | 'CONFIDENTIAL' | 'CONCEPT';
export type DetailLevel = 'BRIEF' | 'STANDARD' | 'DEEP';
export type AnalyticsEventType = 'page_view' | 'project_view' | 'resume_download' | 'contact_click' | 'writing_click';
export type HomeLayoutSectionType = 'hero' | 'experience' | 'featuredProjects' | 'howIWork' | 'metrics' | 'availability' | 'writing' | 'contactCta';

// ============= Site Settings =============

export interface ThemeTokens {
  fontPrimary: string;
  fontSecondary: string;
  colorBackground: string;
  colorForeground: string;
  colorPrimary: string;
  colorAccent: string;
  colorMuted: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  enabled: boolean;
  order: number;
}

export interface SeoDefaults {
  title: string;
  description: string;
  ogImage?: string;
}

export interface ExternalLink {
  id: string;
  label: string;
  url: string;
  icon?: string;
}

export interface ResumeData {
  experience: {
    title: string;
    company: string;
    period: string;
    description: string;
  }[];
  skills: string[];
  education: {
    degree: string;
    institution: string;
    period: string;
  }[];
  certifications?: string[];
}

export interface SiteSettings {
  id: string;
  siteName: string;
  siteDescription: string;
  ownerName: string;
  ownerEmail: string;
  ownerTitle?: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  theme: ThemeTokens;
  navigation: NavItem[];
  seoDefaults?: SeoDefaults;
  faviconUrl?: string;
  appleTouchIconUrl?: string;
  resumePdfUrl?: string;
  resumeData?: ResumeData;
  calendarUrl?: string;
  externalLinks?: ExternalLink[];
  createdAt: string;
  updatedAt: string;
}

// ============= Home Layout =============

export interface HomeLayoutSection {
  id: string;
  type: HomeLayoutSectionType;
  enabled: boolean;
  order: number;
  titleOverride?: string;
  config?: Record<string, unknown>;
}

export interface HomeLayout {
  id: string;
  sections: HomeLayoutSection[];
  createdAt: string;
  updatedAt: string;
}

// ============= Projects =============

export type MediaType = 'image' | 'video';

export interface ProjectMedia {
  id: string;
  type: MediaType;
  url: string;
  caption: string;
  order: number;
}

export interface ProjectDecision {
  id: string;
  decision: string;
  tradeoff: string;
  outcome: string;
}

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectSections {
  overview?: string;
  context?: string;
  problem?: string;
  role?: string;
  constraints?: string;
  approach?: string;
  execution?: string;
  impact?: string;
  learnings?: string;
  links?: string;
}

export interface ProjectContent {
  id: string;
  projectId: string;
  detailLevel: DetailLevel;
  headline: string;
  summary: string;
  body: string;
  sections?: ProjectSections;
  decisions?: ProjectDecision[];
  metrics?: ProjectMetric[];
  media?: ProjectMedia[];
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  status: ProjectStatus;
  featured: boolean;
  tags: string[];
  thumbnailUrl?: string;
  startDate?: string;
  endDate?: string;
  externalUrl?: string;
  order: number;
  content: ProjectContent[];
  relatedProjectSlugs?: string[];
  createdAt: string;
  updatedAt: string;
}

// ============= Writing =============

export interface WritingItem {
  id: string;
  categoryId: string;
  slug: string;
  title: string;
  externalUrl: string;
  platform?: string;
  featured: boolean;
  enabled: boolean;
  whyThisMatters?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface WritingCategory {
  id: string;
  slug: string;
  name: string;
  enabled: boolean;
  order: number;
  items: WritingItem[];
  createdAt: string;
  updatedAt: string;
}

export interface WritingSettings {
  pageTitle: string;
  pageIntro: string;
}

export interface WritingData {
  settings: WritingSettings;
  categories: WritingCategory[];
}

// ============= Analytics =============

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  path: string;
  referrer?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export interface AnalyticsSummary {
  totalViews: number;
  topProjects: { slug: string; title: string; views: number }[];
  resumeDownloads: number;
  contactClicks: number;
  writingClicks: number;
}

// ============= Auth =============

export interface AdminUser {
  id: string;
  email: string;
  name: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// ============= API Response =============

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Note: Input types are defined in schemas/index.ts via Zod inference
