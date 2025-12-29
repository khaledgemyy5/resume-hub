import type { DataClient, TrackEventInput } from './types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export class HttpDataClient implements DataClient {
  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options?.headers },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  async getPublicSettings() { return this.request('/settings'); }
  async getHomeLayout() { return this.request('/home-layout'); }
  async getPublishedProjects() { return this.request('/projects'); }
  async getProjectBySlug(slug: string) { return this.request(`/projects/${slug}`); }
  async getWritingData() { return this.request('/writing'); }
  async trackEvent(event: TrackEventInput) { await this.request('/events', { method: 'POST', body: JSON.stringify(event) }); }

  async adminLogin(email: string, password: string) { return this.request('/admin/login', { method: 'POST', body: JSON.stringify({ email, password }) }); }
  async adminLogout() { await this.request('/admin/logout', { method: 'POST' }); }
  async adminMe() { return this.request('/admin/me'); }
  async adminGetSettings() { return this.request('/admin/settings'); }
  async adminUpdateSettings(data: unknown) { return this.request('/admin/settings', { method: 'PUT', body: JSON.stringify(data) }); }
  async adminGetHomeLayout() { return this.request('/admin/home-layout'); }
  async adminUpdateHomeLayout(data: unknown) { return this.request('/admin/home-layout', { method: 'PUT', body: JSON.stringify(data) }); }
  async adminGetProjects() { return this.request('/admin/projects'); }
  async adminGetProject(id: string) { return this.request(`/admin/projects/${id}`); }
  async adminCreateProject(data: unknown) { return this.request('/admin/projects', { method: 'POST', body: JSON.stringify(data) }); }
  async adminUpdateProject(id: string, data: unknown) { return this.request(`/admin/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
  async adminDeleteProject(id: string) { await this.request(`/admin/projects/${id}`, { method: 'DELETE' }); }
  async adminCreateProjectContent(projectId: string, data: unknown) { return this.request(`/admin/projects/${projectId}/content`, { method: 'POST', body: JSON.stringify(data) }); }
  async adminUpdateProjectContent(id: string, data: unknown) { return this.request(`/admin/content/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
  async adminDeleteProjectContent(id: string) { await this.request(`/admin/content/${id}`, { method: 'DELETE' }); }
  async adminGetWritingCategories() { return this.request('/admin/writing/categories'); }
  async adminGetWritingCategory(id: string) { return this.request(`/admin/writing/categories/${id}`); }
  async adminCreateWritingCategory(data: unknown) { return this.request('/admin/writing/categories', { method: 'POST', body: JSON.stringify(data) }); }
  async adminUpdateWritingCategory(id: string, data: unknown) { return this.request(`/admin/writing/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
  async adminDeleteWritingCategory(id: string) { await this.request(`/admin/writing/categories/${id}`, { method: 'DELETE' }); }
  async adminCreateWritingItem(categoryId: string, data: unknown) { return this.request(`/admin/writing/categories/${categoryId}/items`, { method: 'POST', body: JSON.stringify(data) }); }
  async adminUpdateWritingItem(id: string, data: unknown) { return this.request(`/admin/writing/items/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
  async adminDeleteWritingItem(id: string) { await this.request(`/admin/writing/items/${id}`, { method: 'DELETE' }); }
}