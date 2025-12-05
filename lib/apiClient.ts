/**
 * API Client Service Layer
 * Centralized client for all /api/v1 endpoints
 */

const API_BASE = '/api/v1';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
  requireAuth?: boolean;
  skipRedirectOn401?: boolean;
}

class ApiClient {
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    
    // Try localStorage first (for backward compatibility)
    const localToken = localStorage.getItem('access_token');
    if (localToken) return localToken;
    
    // Try cookie (for SSR support)
    const cookieToken = this.getAccessTokenFromCookie();
    if (cookieToken) {
      // Sync to localStorage for consistency
      localStorage.setItem('access_token', cookieToken);
      return cookieToken;
    }
    
    return null;
  }

  private getAccessTokenFromCookie(): string | null {
    if (typeof document === 'undefined') return null;
    
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'access_token' || name === 'access_token_client') {
        return decodeURIComponent(value);
      }
    }
    return null;
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
          // Store in both localStorage and sync cookie
          localStorage.setItem('access_token', data.access_token);
          // Cookie is set by server, but ensure client has it
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
    const { params, requireAuth = true, skipRedirectOn401 = false, ...fetchOptions } = options;

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
        // Refresh failed – surface 401 to caller instead of forcing redirect
        return { data: null, error: { message: 'Unauthorized', status: 401 } };
      }

      let data;
      try {
        data = await response.json();
      } catch (e) {
        // If response is not JSON, create error
        const text = await response.text();
        return {
          data: null,
          error: {
            message: `Invalid response: ${text.substring(0, 100)}`,
            status: response.status,
          },
        };
      }

      if (!response.ok) {
        // Ensure error object has message
        const error = {
          ...data,
          message: data.message || data.error || `Request failed with status ${response.status}`,
          status: response.status,
        };
        return { data: null, error };
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
    // Clear cookie by setting it to expire
    if (typeof document !== 'undefined') {
      document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
    return result;
  }

  async getCurrentUser(options?: { skipRedirect?: boolean }) {
    return this.request<{ user: any }>('/auth/me', {
      ...options,
      skipRedirectOn401: options?.skipRedirect,
    });
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
    minPrice?: number;
    limit?: number;
    offset?: number;
  }) {
    const params: any = { ...filters };
    if (params.minPrice) {
      params.minPrice = params.minPrice.toString();
    }
    return this.request<{ jobs: any[] }>('/jobs', {
      params,
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

  async purchaseCredits(payload: { package_id: string } | { amount: number; currency?: string }) {
    return this.request<{ payment_intent_id?: string; purchase_id?: string; credits?: number; status?: string; demo?: boolean; message?: string }>('/credits/purchase', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getCreditPackages(userType: 'worker' | 'client' = 'worker') {
    return this.request<{ packages: any[] }>('/credits/packages', {
      params: { user_type: userType },
      requireAuth: false,
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

  // Platform config
  async getPlatformConfig() {
    return this.request<Record<string, any>>('/platform-config', {
      requireAuth: false,
    });
  }

  // Subscriptions
  async getSubscriptionPlans(userType: 'worker' | 'client') {
    return this.request<{ plans: any[] }>('/subscriptions/plans', {
      params: { user_type: userType },
      requireAuth: false,
    });
  }

  async subscribeToPlan(planId: string) {
    return this.request<{ subscription: any; demo: boolean; message: string }>('/subscriptions/subscribe', {
      method: 'POST',
      body: JSON.stringify({ plan_id: planId }),
    });
  }

  // Commissions
  async calculateCommission(params: {
    price: number;
    job_id?: string;
    worker_id?: string;
    client_id?: string;
    is_microtask?: boolean;
  }) {
    return this.request<{ breakdown: any; is_microtask?: boolean }>('/commissions/calc', {
      params: params as any,
    });
  }

  // Escrows
  async releaseEscrow(escrowId: string) {
    return this.request<{ escrow: any; demo: boolean; message: string }>(`/escrows/${escrowId}/release`, {
      method: 'POST',
    });
  }

  // Worker availability
  async updateAvailability(data: {
    availability?: Record<string, any>;
    open_to_work?: boolean;
    priority_tier?: 'standard' | 'priority' | 'elite';
  }) {
    return this.request('/workers/availability', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAvailability() {
    return this.request('/workers/availability', {
      method: 'GET',
    });
  }

  // Worker pool
  async getWorkerPool(params: {
    skill?: string;
    tier?: string;
    limit?: number;
  }) {
    const query = new URLSearchParams();
    if (params.skill) query.append('skill', params.skill);
    if (params.tier) query.append('tier', params.tier);
    if (params.limit) query.append('limit', params.limit.toString());
    return this.request(`/workers/pool?${query.toString()}`, {
      method: 'GET',
    });
  }

  // Sourcing requests
  async getSourcingRequests(status?: string) {
    const query = status ? `?status=${status}` : '';
    return this.request(`/sourcing_requests${query}`, {
      method: 'GET',
    });
  }

  async createSourcingRequest(data: {
    job_id: string;
    flags?: Record<string, any>;
    escalate_after_minutes?: number;
  }) {
    return this.request('/sourcing_requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async contactWorker(requestId: string, data: {
    worker_id: string;
    contact_method: 'email' | 'sms' | 'whatsapp' | 'push';
    message?: string;
  }) {
    return this.request(`/sourcing_requests/${requestId}/contact`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Alerts
  async getAlerts() {
    return this.request('/alerts', {
      method: 'GET',
    });
  }

  async respondToAlert(data: {
    alert_id: string;
    job_id: string;
    cover_text?: string;
    proposed_price?: number;
  }) {
    return this.request('/alerts/respond', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Job escalation
  async escalateJob(jobId: string) {
    return this.request(`/jobs/${jobId}/escalate`, {
      method: 'POST',
    });
  }

  // AI Job Wizard
  async generateJobSpec(requirement: string) {
    return this.request('/job-wizard', {
      method: 'POST',
      body: JSON.stringify({ requirement }),
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
