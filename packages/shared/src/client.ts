import type {
  SiteSettings,
  HomeLayout,
  HomeLayoutSection,
  Project,
  ProjectContent,
  ProjectMedia,
  ProjectDecision,
  ProjectMetric,
  ProjectSections,
  WritingData,
  WritingCategory,
  WritingItem,
  AnalyticsEvent,
  AdminUser,
  AuthTokens,
  LoginCredentials,
  ThemeTokens,
  NavItem,
  SeoDefaults,
  ExternalLink,
  ResumeData,
} from './types';
import type {
  SiteSettingsInput,
  HomeLayoutInput,
  ProjectInput,
  ProjectContentInput,
  WritingCategoryInput,
  WritingItemInput,
  TrackEventInput,
} from './schemas';

// ============= Data Client Interface =============

export interface DataClient {
  // ============= Public Methods =============
  
  /** Get public site settings */
  getPublicSettings(): Promise<SiteSettings>;
  
  /** Get home page layout configuration */
  getHomeLayout(): Promise<HomeLayout>;
  
  /** Get all published (public status) projects */
  getPublishedProjects(): Promise<Project[]>;
  
  /** Get all visible projects (public + confidential, excludes concepts) */
  getVisibleProjects(): Promise<Project[]>;
  
  /** Get a single project by slug (public or confidential) */
  getProjectBySlug(slug: string): Promise<Project | null>;
  
  /** Get all writing data (categories with items) */
  getWritingData(): Promise<WritingData>;
  
  /** Track an analytics event */
  trackEvent(event: TrackEventInput): Promise<void>;

  // ============= Admin Auth Methods =============
  
  /** Admin login */
  adminLogin(email: string, password: string): Promise<AuthTokens>;
  
  /** Admin logout */
  adminLogout(): Promise<void>;
  
  /** Get current admin user */
  adminMe(): Promise<AdminUser | null>;

  // ============= Admin Settings Methods =============
  
  /** Get site settings (admin) */
  adminGetSettings(): Promise<SiteSettings>;
  
  /** Update site settings (admin) */
  adminUpdateSettings(data: SiteSettingsInput): Promise<SiteSettings>;

  // ============= Admin Home Layout Methods =============
  
  /** Get home layout (admin) */
  adminGetHomeLayout(): Promise<HomeLayout>;
  
  /** Update home layout (admin) */
  adminUpdateHomeLayout(data: HomeLayoutInput): Promise<HomeLayout>;

  // ============= Admin Project Methods =============
  
  /** Get all projects (admin) */
  adminGetProjects(): Promise<Project[]>;
  
  /** Get single project by ID (admin) */
  adminGetProject(id: string): Promise<Project | null>;
  
  /** Create a new project (admin) */
  adminCreateProject(data: ProjectInput): Promise<Project>;
  
  /** Update a project (admin) */
  adminUpdateProject(id: string, data: Partial<ProjectInput>): Promise<Project>;
  
  /** Delete a project (admin) */
  adminDeleteProject(id: string): Promise<void>;

  // ============= Admin Project Content Methods =============
  
  /** Create project content (admin) */
  adminCreateProjectContent(projectId: string, data: ProjectContentInput): Promise<ProjectContent>;
  
  /** Update project content (admin) */
  adminUpdateProjectContent(id: string, data: Partial<ProjectContentInput>): Promise<ProjectContent>;
  
  /** Delete project content (admin) */
  adminDeleteProjectContent(id: string): Promise<void>;

  // ============= Admin Writing Category Methods =============
  
  /** Get all writing categories (admin) */
  adminGetWritingCategories(): Promise<WritingCategory[]>;
  
  /** Get single writing category (admin) */
  adminGetWritingCategory(id: string): Promise<WritingCategory | null>;
  
  /** Create a writing category (admin) */
  adminCreateWritingCategory(data: WritingCategoryInput): Promise<WritingCategory>;
  
  /** Update a writing category (admin) */
  adminUpdateWritingCategory(id: string, data: Partial<WritingCategoryInput>): Promise<WritingCategory>;
  
  /** Delete a writing category (admin) */
  adminDeleteWritingCategory(id: string): Promise<void>;

  // ============= Admin Writing Item Methods =============
  
  /** Create a writing item (admin) */
  adminCreateWritingItem(categoryId: string, data: WritingItemInput): Promise<WritingItem>;
  
  /** Update a writing item (admin) */
  adminUpdateWritingItem(id: string, data: Partial<WritingItemInput>): Promise<WritingItem>;
  
  /** Delete a writing item (admin) */
  adminDeleteWritingItem(id: string): Promise<void>;
}

// Re-export types for convenience
export type {
  SiteSettings,
  HomeLayout,
  HomeLayoutSection,
  Project,
  ProjectContent,
  ProjectMedia,
  ProjectDecision,
  ProjectMetric,
  ProjectSections,
  WritingData,
  WritingCategory,
  WritingItem,
  AnalyticsEvent,
  AdminUser,
  AuthTokens,
  LoginCredentials,
  ThemeTokens,
  NavItem,
  SeoDefaults,
  ExternalLink,
  ResumeData,
};

// Re-export input types from schemas
export type {
  SiteSettingsInput,
  HomeLayoutInput,
  ProjectInput,
  ProjectContentInput,
  WritingCategoryInput,
  WritingItemInput,
  TrackEventInput,
};