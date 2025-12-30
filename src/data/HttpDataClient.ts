import type {
  DataClient,
  SiteSettings,
  HomeLayout,
  Project,
  ProjectContent,
  WritingData,
  WritingCategory,
  WritingItem,
  AuthTokens,
  AdminUser,
  SiteSettingsInput,
  HomeLayoutInput,
  ProjectInput,
  ProjectContentInput,
  WritingCategoryInput,
  WritingItemInput,
  TrackEventInput,
} from './types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export class HttpDataClient implements DataClient {
  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options?.headers },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json() as Promise<T>;
  }

  // Public methods
  getPublicSettings(): Promise<SiteSettings> { return this.request<SiteSettings>('/settings'); }
  getHomeLayout(): Promise<HomeLayout> { return this.request<HomeLayout>('/home-layout'); }
  getPublishedProjects(): Promise<Project[]> { return this.request<Project[]>('/projects?status=public'); }
  getVisibleProjects(): Promise<Project[]> { return this.request<Project[]>('/projects'); }
  getProjectBySlug(slug: string): Promise<Project | null> { return this.request<Project | null>(`/projects/${slug}`); }
  getWritingData(): Promise<WritingData> { return this.request<WritingData>('/writing'); }
  async trackEvent(event: TrackEventInput): Promise<void> { await this.request<void>('/events', { method: 'POST', body: JSON.stringify(event) }); }

  // Admin auth
  adminLogin(email: string, password: string): Promise<AuthTokens> { return this.request<AuthTokens>('/admin/login', { method: 'POST', body: JSON.stringify({ email, password }) }); }
  async adminLogout(): Promise<void> { await this.request<void>('/admin/logout', { method: 'POST' }); }
  adminMe(): Promise<AdminUser | null> { return this.request<AdminUser | null>('/admin/me'); }

  // Admin settings
  adminGetSettings(): Promise<SiteSettings> { return this.request<SiteSettings>('/admin/settings'); }
  adminUpdateSettings(data: SiteSettingsInput): Promise<SiteSettings> { return this.request<SiteSettings>('/admin/settings', { method: 'PUT', body: JSON.stringify(data) }); }

  // Admin home layout
  adminGetHomeLayout(): Promise<HomeLayout> { return this.request<HomeLayout>('/admin/home-layout'); }
  adminUpdateHomeLayout(data: HomeLayoutInput): Promise<HomeLayout> { return this.request<HomeLayout>('/admin/home-layout', { method: 'PUT', body: JSON.stringify(data) }); }

  // Admin projects
  adminGetProjects(): Promise<Project[]> { return this.request<Project[]>('/admin/projects'); }
  adminGetProject(id: string): Promise<Project | null> { return this.request<Project | null>(`/admin/projects/${id}`); }
  adminCreateProject(data: ProjectInput): Promise<Project> { return this.request<Project>('/admin/projects', { method: 'POST', body: JSON.stringify(data) }); }
  adminUpdateProject(id: string, data: Partial<ProjectInput>): Promise<Project> { return this.request<Project>(`/admin/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
  async adminDeleteProject(id: string): Promise<void> { await this.request<void>(`/admin/projects/${id}`, { method: 'DELETE' }); }

  // Admin project content
  adminCreateProjectContent(projectId: string, data: ProjectContentInput): Promise<ProjectContent> { return this.request<ProjectContent>(`/admin/projects/${projectId}/content`, { method: 'POST', body: JSON.stringify(data) }); }
  adminUpdateProjectContent(id: string, data: Partial<ProjectContentInput>): Promise<ProjectContent> { return this.request<ProjectContent>(`/admin/content/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
  async adminDeleteProjectContent(id: string): Promise<void> { await this.request<void>(`/admin/content/${id}`, { method: 'DELETE' }); }

  // Admin writing categories
  adminGetWritingCategories(): Promise<WritingCategory[]> { return this.request<WritingCategory[]>('/admin/writing/categories'); }
  adminGetWritingCategory(id: string): Promise<WritingCategory | null> { return this.request<WritingCategory | null>(`/admin/writing/categories/${id}`); }
  adminCreateWritingCategory(data: WritingCategoryInput): Promise<WritingCategory> { return this.request<WritingCategory>('/admin/writing/categories', { method: 'POST', body: JSON.stringify(data) }); }
  adminUpdateWritingCategory(id: string, data: Partial<WritingCategoryInput>): Promise<WritingCategory> { return this.request<WritingCategory>(`/admin/writing/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
  async adminDeleteWritingCategory(id: string): Promise<void> { await this.request<void>(`/admin/writing/categories/${id}`, { method: 'DELETE' }); }

  // Admin writing items
  adminCreateWritingItem(categoryId: string, data: WritingItemInput): Promise<WritingItem> { return this.request<WritingItem>(`/admin/writing/categories/${categoryId}/items`, { method: 'POST', body: JSON.stringify(data) }); }
  adminUpdateWritingItem(id: string, data: Partial<WritingItemInput>): Promise<WritingItem> { return this.request<WritingItem>(`/admin/writing/items/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
  async adminDeleteWritingItem(id: string): Promise<void> { await this.request<void>(`/admin/writing/items/${id}`, { method: 'DELETE' }); }
}
