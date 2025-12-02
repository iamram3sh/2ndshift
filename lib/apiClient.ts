/**
 * API Client Service Layer
 * Centralized client for all /api/v1 endpoints
 */

const API_BASE = '/api/v1';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
  requireAuth?: boolean;
}

class ApiClient {
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    // Try to get token from localStorage or cookie
    return localStorage.getItem('access_token');
  }

  private async refreshToken(): Promise<string | null> {
    try {
      const response = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.access_token) {
          localStorage.setItem('access_token', data.access_token);
          return data.access_token;
        }
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
    return null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<{ data: T; error: null } | { data: null; error: any }> {
    const { params, requireAuth = true, ...fetchOptions } = options;

    // Build URL with params
    let url = `${API_BASE}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, String(value));
      });
      url += `?${searchParams.toString()}`;
    }

    // Add auth header if required
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(fetchOptions.headers as Record<string, string> || {}),
    };

    if (requireAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        credentials: 'include',
      });

      // Handle token refresh on 401
      if (response.status === 401 && requireAuth) {
        const newToken = await this.refreshToken();
        if (newToken) {
          const retryHeaders: Record<string, string> = {
            ...headers,
            'Authorization': `Bearer ${newToken}`,
          };
          const retryResponse = await fetch(url, {
            ...fetchOptions,
            headers: retryHeaders,
            credentials: 'include',
          });
          const retryData = await retryResponse.json();
          if (retryResponse.ok) {
            return { data: retryData, error: null };
          }
        }
        // Refresh failed, redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return { data: null, error: { message: 'Unauthorized' } };
      }

      const data = await response.json();

      if (!response.ok) {
        return { data: null, error: data };
      }

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message || 'Request failed' } };
    }
  }

  // Auth endpoints
  async register(payload: {
    role: 'worker' | 'client' | 'admin';
    email: string;
    password: string;
    name: string;
    phone?: string;
  }) {
    const result = await this.request<{ access_token: string; user: any }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(payload),
        requireAuth: false,
      }
    );
    if (result.data?.access_token) {
      localStorage.setItem('access_token', result.data.access_token);
    }
    return result;
  }

  async login(email: string, password: string) {
    const result = await this.request<{ access_token: string; user: any }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        requireAuth: false,
      }
    );
    if (result.data?.access_token) {
      localStorage.setItem('access_token', result.data.access_token);
    }
    return result;
  }

  async logout() {
    const result = await this.request('/auth/logout', {
      method: 'POST',
    });
    localStorage.removeItem('access_token');
    return result;
  }

  async getCurrentUser() {
    return this.request<{ user: any }>('/auth/me');
  }

  async refreshAccessToken() {
    const result = await this.request<{ access_token: string }>('/auth/refresh', {
      method: 'POST',
      requireAuth: false,
    });
    if (result.data?.access_token) {
      localStorage.setItem('access_token', result.data.access_token);
    }
    return result;
  }

  // Jobs endpoints
  async listJobs(filters?: {
    status?: string;
    category_id?: string;
    role?: 'worker' | 'client';
  }) {
    return this.request<{ jobs: any[] }>('/jobs', {
      params: filters as any,
    });
  }

  async getJob(id: string) {
    return this.request<{ job: any }>(`/jobs/${id}`);
  }

  async createJob(payload: {
    title: string;
    description: string;
    category_id?: string;
    microtask_id?: string;
    price_fixed?: number;
    delivery_window?: string;
  }) {
    return this.request<{ job: any }>('/jobs', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async applyToJob(jobId: string, payload: {
    cover_text?: string;
    proposed_price?: number;
    proposed_delivery?: string;
  }) {
    return this.request<{ application: any }>(`/jobs/${jobId}/apply`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async acceptProposal(jobId: string, applicationId: string) {
    return this.request<{ job: any }>(`/jobs/${jobId}/accept-proposal`, {
      method: 'POST',
      body: JSON.stringify({ application_id: applicationId }),
    });
  }

  async deliverJob(jobId: string, payload: {
    delivery_notes: string;
    attachments?: string[];
  }) {
    return this.request<{ job: any }>(`/jobs/${jobId}/deliver`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async approveJob(jobId: string) {
    return this.request<{ job: any }>(`/jobs/${jobId}/approve`, {
      method: 'POST',
    });
  }

  // Credits endpoints
  async getCreditsBalance() {
    return this.request<{ balance: number; reserved: number }>('/credits/balance');
  }

  async purchaseCredits(payload: { amount: number; currency?: string }) {
    return this.request<{ payment_intent: any }>('/credits/purchase', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Categories endpoints
  async listCategories() {
    return this.request<{ categories: any[] }>('/categories', {
      requireAuth: false,
    });
  }

  async listMicrotasks(categoryId: string) {
    return this.request<{ microtasks: any[] }>(
      `/categories/${categoryId}/microtasks`,
      { requireAuth: false }
    );
  }

  // Matching endpoints
  async autoMatch(jobId: string) {
    return this.request<{ matches: any[] }>('/matching/auto-match', {
      method: 'POST',
      body: JSON.stringify({ job_id: jobId }),
    });
  }

  async suggestWorkers(rawText: string) {
    return this.request<{ workers: any[] }>('/matching/suggest-workers', {
      method: 'POST',
      body: JSON.stringify({ raw_text: rawText }),
    });
  }

  // Missing tasks
  async submitMissingTask(rawText: string) {
    return this.request<{ request: any }>('/missing-tasks', {
      method: 'POST',
      body: JSON.stringify({ raw_text: rawText }),
    });
  }

  // Admin endpoints
  async listAllJobs(filters?: { status?: string }) {
    return this.request<{ jobs: any[] }>('/admin/jobs', {
      params: filters as any,
    });
  }

  async listAllUsers(filters?: { role?: string }) {
    return this.request<{ users: any[] }>('/admin/users', {
      params: filters as any,
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
