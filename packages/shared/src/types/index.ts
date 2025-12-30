// ============= Enums as String Literals =============

export type ProjectStatus = 'PUBLIC' | 'CONFIDENTIAL' | 'CONCEPT';
export type DetailLevel = 'BRIEF' | 'STANDARD' | 'DEEP';
export type AnalyticsEventType = 'page_view' | 'project_view' | 'writing_view' | 'external_link_click' | 'contact_click';
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

export interface SiteSettings {
  id: string;
  siteName: string;
  siteDescription: string;
  ownerName: string;
  ownerEmail: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  theme: ThemeTokens;
  navigation: NavItem[];
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

export interface ProjectContent {
  id: string;
  projectId: string;
  detailLevel: DetailLevel;
  headline: string;
  summary: string;
  body: string;
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
  createdAt: string;
  updatedAt: string;
}

// ============= Writing =============

export interface WritingItem {
  id: string;
  categoryId: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  published: boolean;
  publishedAt?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface WritingCategory {
  id: string;
  slug: string;
  name: string;
  description?: string;
  order: number;
  items: WritingItem[];
  createdAt: string;
  updatedAt: string;
}

export interface WritingData {
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
