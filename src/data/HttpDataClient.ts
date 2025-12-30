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
  AnalyticsSummary,
  SiteSettingsInput,
  HomeLayoutInput,
  ProjectInput,
  ProjectContentInput,
  WritingCategoryInput,
  WritingItemInput,
  TrackEventInput,
} from './types';

// ============= Configuration =============

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';
const REQUEST_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second

const CSRF_COOKIE_NAME = 'csrf_token';
const CSRF_HEADER_NAME = 'x-csrf-token';

// ============= Error Types =============

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

// ============= Utilities =============

/**
 * Read CSRF token from cookie
 */
function getCsrfToken(): string | null {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === CSRF_COOKIE_NAME) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

/**
 * Sleep for a given number of milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if a request method is safe (can be retried)
 */
function isSafeMethod(method: string | undefined): boolean {
  return !method || method === 'GET' || method === 'HEAD' || method === 'OPTIONS';
}

// ============= API Response Types =============

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// ============= HTTP Data Client =============

export class HttpDataClient implements DataClient {
  /**
   * Core request handler with timeout, retries (for GET only), and error normalization
   */
  private async request<T>(
    path: string,
    options?: RequestInit & { skipCsrf?: boolean }
  ): Promise<T> {
    const url = `${API_BASE}${path}`;
    const method = options?.method || 'GET';
    const canRetry = isSafeMethod(method);
    const skipCsrf = options?.skipCsrf ?? false;

    // Build headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options?.headers as Record<string, string>),
    };

    // Add CSRF token for state-changing requests
    if (!isSafeMethod(method) && !skipCsrf) {
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        headers[CSRF_HEADER_NAME] = csrfToken;
      }
    }

    const fetchOptions: RequestInit = {
      ...options,
      method,
      headers,
      credentials: 'include', // Always send cookies
    };

    let lastError: Error | null = null;
    const attempts = canRetry ? MAX_RETRIES + 1 : 1;

    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        const response = await this.fetchWithTimeout(url, fetchOptions);
        return await this.handleResponse<T>(response);
      } catch (error) {
        lastError = error as Error;

        // Don't retry on client errors (4xx) or if not a safe method
        if (error instanceof HttpError && error.status >= 400 && error.status < 500) {
          throw error;
        }

        // Retry only for safe methods and server/network errors
        if (canRetry && attempt < attempts) {
          await sleep(RETRY_DELAY * attempt);
          continue;
        }

        throw error;
      }
    }

    throw lastError || new HttpError(500, 'UNKNOWN_ERROR', 'Request failed');
  }

  /**
   * Fetch with timeout support
   */
  private async fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      return response;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new HttpError(408, 'TIMEOUT', 'Request timed out');
      }
      // Normalize network errors
      throw new HttpError(0, 'NETWORK_ERROR', 'Network request failed');
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Handle API response and extract data
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    // Handle empty responses (204 No Content)
    if (response.status === 204) {
      return undefined as T;
    }

    let body: ApiResponse<T>;
    try {
      body = await response.json();
    } catch {
      throw new HttpError(
        response.status,
        'PARSE_ERROR',
        'Failed to parse response'
      );
    }

    if (!response.ok || !body.success) {
      throw new HttpError(
        response.status,
        body.error?.code || 'API_ERROR',
        body.error?.message || `HTTP ${response.status}`
      );
    }

    return body.data as T;
  }

  // ============= Public Methods =============

  async getPublicSettings(): Promise<SiteSettings> {
    return this.request<SiteSettings>('/public/settings');
  }

  async getHomeLayout(): Promise<HomeLayout> {
    return this.request<HomeLayout>('/public/home-layout');
  }

  async getPublishedProjects(): Promise<Project[]> {
    return this.request<Project[]>('/public/projects');
  }

  async getVisibleProjects(): Promise<Project[]> {
    // Public endpoint returns only PUBLIC projects
    // For visible (PUBLIC + CONFIDENTIAL), this would need auth
    return this.request<Project[]>('/public/projects');
  }

  async getProjectBySlug(slug: string): Promise<Project | null> {
    try {
      return await this.request<Project>(`/public/projects/${encodeURIComponent(slug)}`);
    } catch (error) {
      if (error instanceof HttpError && error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async getWritingData(): Promise<WritingData> {
    return this.request<WritingData>('/public/writing');
  }

  async trackEvent(event: TrackEventInput): Promise<void> {
    // Try sendBeacon first for reliability on page unload
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const url = `${API_BASE}/public/events`;
      const blob = new Blob([JSON.stringify(event)], { type: 'application/json' });
      const sent = navigator.sendBeacon(url, blob);
      if (sent) return;
    }

    // Fallback to regular POST
    await this.request<void>('/public/events', {
      method: 'POST',
      body: JSON.stringify(event),
      skipCsrf: true, // Public endpoint, no CSRF needed
    });
  }

  // ============= Admin Auth Methods =============

  async adminLogin(email: string, password: string): Promise<AuthTokens> {
    await this.request<{ user: AdminUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      skipCsrf: true, // Login doesn't require CSRF (no session yet)
    });
    
    // The API sets cookies - return placeholder tokens since we use cookie-based auth
    // The AdminAuthContext will call adminMe() to get user data
    return {
      accessToken: '', // Token is in httpOnly cookie
      refreshToken: '',
      expiresIn: 86400, // 24 hours (matches cookie)
    };
  }

  async adminLogout(): Promise<void> {
    await this.request<void>('/auth/logout', {
      method: 'POST',
    });
  }

  async adminMe(): Promise<AdminUser | null> {
    try {
      const result = await this.request<{ user: AdminUser }>('/auth/me');
      return result.user;
    } catch (error) {
      if (error instanceof HttpError && error.status === 401) {
        return null;
      }
      throw error;
    }
  }

  // ============= Admin Settings Methods =============

  async adminGetSettings(): Promise<SiteSettings> {
    return this.request<SiteSettings>('/admin/settings');
  }

  async adminUpdateSettings(data: SiteSettingsInput): Promise<SiteSettings> {
    return this.request<SiteSettings>('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // ============= Admin Home Layout Methods =============

  async adminGetHomeLayout(): Promise<HomeLayout> {
    return this.request<HomeLayout>('/admin/home-layout');
  }

  async adminUpdateHomeLayout(data: HomeLayoutInput): Promise<HomeLayout> {
    return this.request<HomeLayout>('/admin/home-layout', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // ============= Admin Project Methods =============

  async adminGetProjects(): Promise<Project[]> {
    return this.request<Project[]>('/admin/projects');
  }

  async adminGetProject(id: string): Promise<Project | null> {
    try {
      return await this.request<Project>(`/admin/projects/${encodeURIComponent(id)}`);
    } catch (error) {
      if (error instanceof HttpError && error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async adminCreateProject(data: ProjectInput): Promise<Project> {
    return this.request<Project>('/admin/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async adminUpdateProject(id: string, data: Partial<ProjectInput>): Promise<Project> {
    return this.request<Project>(`/admin/projects/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async adminDeleteProject(id: string): Promise<void> {
    await this.request<void>(`/admin/projects/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  }

  // ============= Admin Project Content Methods =============

  async adminCreateProjectContent(projectId: string, data: ProjectContentInput): Promise<ProjectContent> {
    return this.request<ProjectContent>(`/admin/projects/${encodeURIComponent(projectId)}/content`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async adminUpdateProjectContent(id: string, data: Partial<ProjectContentInput>): Promise<ProjectContent> {
    return this.request<ProjectContent>(`/admin/content/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async adminDeleteProjectContent(id: string): Promise<void> {
    await this.request<void>(`/admin/content/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  }

  // ============= Admin Writing Category Methods =============

  async adminGetWritingCategories(): Promise<WritingCategory[]> {
    return this.request<WritingCategory[]>('/admin/writing/categories');
  }

  async adminGetWritingCategory(id: string): Promise<WritingCategory | null> {
    try {
      return await this.request<WritingCategory>(`/admin/writing/categories/${encodeURIComponent(id)}`);
    } catch (error) {
      if (error instanceof HttpError && error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async adminCreateWritingCategory(data: WritingCategoryInput): Promise<WritingCategory> {
    return this.request<WritingCategory>('/admin/writing/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async adminUpdateWritingCategory(id: string, data: Partial<WritingCategoryInput>): Promise<WritingCategory> {
    return this.request<WritingCategory>(`/admin/writing/categories/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async adminDeleteWritingCategory(id: string): Promise<void> {
    await this.request<void>(`/admin/writing/categories/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  }

  // ============= Admin Writing Item Methods =============

  async adminCreateWritingItem(categoryId: string, data: WritingItemInput): Promise<WritingItem> {
    return this.request<WritingItem>(`/admin/writing/categories/${encodeURIComponent(categoryId)}/items`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async adminUpdateWritingItem(id: string, data: Partial<WritingItemInput>): Promise<WritingItem> {
    return this.request<WritingItem>(`/admin/writing/items/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async adminDeleteWritingItem(id: string): Promise<void> {
    await this.request<void>(`/admin/writing/items/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  }

  // ============= Admin Analytics Methods =============

  async adminGetAnalytics(days = 30): Promise<AnalyticsSummary> {
    return this.request<AnalyticsSummary>(`/admin/analytics?days=${days}`);
  }
}
