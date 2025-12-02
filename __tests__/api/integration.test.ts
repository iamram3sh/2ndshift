/**
 * Comprehensive API Integration Tests
 * Tests all API endpoints end-to-end
 */

import { NextRequest } from 'next/server';
import { POST as registerHandler } from '@/app/api/v1/auth/register/route';
import { POST as loginHandler } from '@/app/api/v1/auth/login/route';
import { GET as meHandler } from '@/app/api/v1/auth/me/route';
import { POST as refreshHandler } from '@/app/api/v1/auth/refresh/route';
import { POST as logoutHandler } from '@/app/api/v1/auth/logout/route';
import { GET as listJobsHandler, POST as createJobHandler } from '@/app/api/v1/jobs/route';
import { GET as getJobHandler } from '@/app/api/v1/jobs/[id]/route';
import { POST as applyJobHandler } from '@/app/api/v1/jobs/[id]/apply/route';
import { POST as acceptProposalHandler } from '@/app/api/v1/jobs/[id]/accept-proposal/route';
import { POST as deliverJobHandler } from '@/app/api/v1/jobs/[id]/deliver/route';
import { POST as approveJobHandler } from '@/app/api/v1/jobs/[id]/approve/route';
import { GET as creditsBalanceHandler } from '@/app/api/v1/credits/balance/route';
import { POST as purchaseCreditsHandler } from '@/app/api/v1/credits/purchase/route';
import { GET as listCategoriesHandler } from '@/app/api/v1/categories/route';
import { GET as listMicrotasksHandler } from '@/app/api/v1/categories/[id]/microtasks/route';
import { POST as autoMatchHandler } from '@/app/api/v1/matching/auto-match/route';
import { POST as suggestWorkersHandler } from '@/app/api/v1/matching/suggest-workers/route';
import { POST as missingTasksHandler } from '@/app/api/v1/missing-tasks/route';
import { GET as adminJobsHandler } from '@/app/api/v1/admin/jobs/route';
import { GET as adminUsersHandler } from '@/app/api/v1/admin/users/route';
import { supabaseAdmin } from '@/lib/supabase/admin';

// Test utilities
function createRequest(method: string, url: string, body?: any, headers?: Record<string, string>): NextRequest {
  const requestHeaders = new Headers({
    'Content-Type': 'application/json',
    ...headers,
  });

  return new NextRequest(url, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });
}

function createRequestWithParams(method: string, url: string, params: any, body?: any, headers?: Record<string, string>): NextRequest {
  const request = createRequest(method, url, body, headers);
  return Object.assign(request, { params: Promise.resolve(params) });
}

describe('API Integration Tests', () => {
  let clientToken: string;
  let workerToken: string;
  let adminToken: string;
  let clientId: string;
  let workerId: string;
  let adminId: string;
  let categoryId: string;
  let microtaskId: string;
  let jobId: string;
  let applicationId: string;

  // Cleanup function
  async function cleanup() {
    // Clean up test data
    if (jobId) {
      await supabaseAdmin.from('jobs').delete().eq('id', jobId);
    }
    if (applicationId) {
      await supabaseAdmin.from('applications').delete().eq('id', applicationId);
    }
    if (clientId) {
      await supabaseAdmin.from('users').delete().eq('id', clientId);
    }
    if (workerId) {
      await supabaseAdmin.from('users').delete().eq('id', workerId);
    }
    if (adminId) {
      await supabaseAdmin.from('users').delete().eq('id', adminId);
    }
  }

  beforeAll(async () => {
    // Create test category
    const { data: category } = await supabaseAdmin
      .from('categories')
      .insert({
        slug: 'test-category',
        name: 'Test Category',
        description: 'Test category for integration tests',
        is_active: true,
      })
      .select()
      .single();
    categoryId = category?.id || '';

    // Create test microtask
    const { data: microtask } = await supabaseAdmin
      .from('microtasks')
      .insert({
        title: 'Test Microtask',
        slug: 'test-microtask',
        description: 'Test microtask for integration tests',
        category_id: categoryId,
        complexity: 'intermediate',
        delivery_window: 'threeTo7d',
        base_price_min: 1000,
        base_price_max: 5000,
      })
      .select()
      .single();
    microtaskId = microtask?.id || '';
  });

  afterAll(async () => {
    await cleanup();
    // Clean up category and microtask
    if (microtaskId) {
      await supabaseAdmin.from('microtasks').delete().eq('id', microtaskId);
    }
    if (categoryId) {
      await supabaseAdmin.from('categories').delete().eq('id', categoryId);
    }
  });

  describe('Authentication', () => {
    test('POST /api/v1/auth/register - Register client', async () => {
      const request = createRequest('POST', '/api/v1/auth/register', {
        role: 'client',
        email: `test-client-${Date.now()}@example.com`,
        password: 'password123',
        name: 'Test Client',
      });

      const response = await registerHandler(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.access_token).toBeDefined();
      expect(data.user.role).toBe('client');
      clientToken = data.access_token;
      clientId = data.user.id;
    });

    test('POST /api/v1/auth/register - Register worker', async () => {
      const request = createRequest('POST', '/api/v1/auth/register', {
        role: 'worker',
        email: `test-worker-${Date.now()}@example.com`,
        password: 'password123',
        name: 'Test Worker',
      });

      const response = await registerHandler(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.access_token).toBeDefined();
      expect(data.user.role).toBe('worker');
      workerToken = data.access_token;
      workerId = data.user.id;

      // Initialize credits for worker
      await supabaseAdmin
        .from('shift_credits')
        .upsert({
          user_id: workerId,
          balance: 100,
          reserved: 0,
        });
    });

    test('POST /api/v1/auth/register - Register admin', async () => {
      const request = createRequest('POST', '/api/v1/auth/register', {
        role: 'admin',
        email: `test-admin-${Date.now()}@example.com`,
        password: 'password123',
        name: 'Test Admin',
      });

      const response = await registerHandler(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.access_token).toBeDefined();
      expect(data.user.role).toBe('admin');
      adminToken = data.access_token;
      adminId = data.user.id;
    });

    test('POST /api/v1/auth/login - Login client', async () => {
      const email = `test-client-${Date.now()}@example.com`;
      // First register
      await registerHandler(createRequest('POST', '/api/v1/auth/register', {
        role: 'client',
        email,
        password: 'password123',
        name: 'Test Client',
      }));

      // Then login
      const request = createRequest('POST', '/api/v1/auth/login', {
        email,
        password: 'password123',
      });

      const response = await loginHandler(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.access_token).toBeDefined();
      expect(data.user.email).toBe(email);
    });

    test('GET /api/v1/auth/me - Get current user', async () => {
      const request = createRequest('GET', '/api/v1/auth/me', undefined, {
        Authorization: `Bearer ${clientToken}`,
      });

      const response = await meHandler(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.user).toBeDefined();
      expect(data.user.id).toBe(clientId);
    });
  });

  describe('Jobs', () => {
    test('POST /api/v1/jobs - Create job (client)', async () => {
      const request = createRequest('POST', '/api/v1/jobs', {
        title: 'Test Job',
        description: 'Test job description',
        category_id: categoryId,
        microtask_id: microtaskId,
        price_fixed: 5000,
        delivery_window: 'threeTo7d',
      }, {
        Authorization: `Bearer ${clientToken}`,
      });

      const response = await createJobHandler(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.job).toBeDefined();
      expect(data.job.title).toBe('Test Job');
      jobId = data.job.id;
    });

    test('GET /api/v1/jobs - List jobs', async () => {
      const request = createRequest('GET', '/api/v1/jobs?status=open', undefined, {
        Authorization: `Bearer ${clientToken}`,
      });

      const response = await listJobsHandler(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.jobs).toBeDefined();
      expect(Array.isArray(data.jobs)).toBe(true);
    });

    test('GET /api/v1/jobs/:id - Get job details', async () => {
      const request = createRequestWithParams('GET', `/api/v1/jobs/${jobId}`, { id: jobId }, undefined, {
        Authorization: `Bearer ${clientToken}`,
      });

      const response = await getJobHandler(request, { params: Promise.resolve({ id: jobId }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.job).toBeDefined();
      expect(data.job.id).toBe(jobId);
    });

    test('POST /api/v1/jobs/:id/apply - Apply to job (worker)', async () => {
      const request = createRequestWithParams('POST', `/api/v1/jobs/${jobId}/apply`, { id: jobId }, {
        cover_text: 'I am interested in this job',
        proposed_price: 4500,
      }, {
        Authorization: `Bearer ${workerToken}`,
      });

      const response = await applyJobHandler(request, { params: Promise.resolve({ id: jobId }) });
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.application).toBeDefined();
      applicationId = data.application.id;
    });

    test('POST /api/v1/jobs/:id/accept-proposal - Accept proposal (client)', async () => {
      const request = createRequestWithParams('POST', `/api/v1/jobs/${jobId}/accept-proposal`, { id: jobId }, {
        application_id: applicationId,
      }, {
        Authorization: `Bearer ${clientToken}`,
      });

      const response = await acceptProposalHandler(request, { params: Promise.resolve({ id: jobId }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.job).toBeDefined();
      expect(data.job.status).toBe('assigned');
    });

    test('POST /api/v1/jobs/:id/deliver - Deliver job (worker)', async () => {
      const request = createRequestWithParams('POST', `/api/v1/jobs/${jobId}/deliver`, { id: jobId }, {
        delivery_notes: 'Job completed successfully',
        attachments: ['https://example.com/delivery.zip'],
      }, {
        Authorization: `Bearer ${workerToken}`,
      });

      const response = await deliverJobHandler(request, { params: Promise.resolve({ id: jobId }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.job).toBeDefined();
    });

    test('POST /api/v1/jobs/:id/approve - Approve job (client)', async () => {
      // First create escrow
      await supabaseAdmin
        .from('escrows')
        .insert({
          job_id: jobId,
          client_id: clientId,
          amount: 5000,
          currency: 'INR',
          status: 'funded',
        });

      const request = createRequestWithParams('POST', `/api/v1/jobs/${jobId}/approve`, { id: jobId }, undefined, {
        Authorization: `Bearer ${clientToken}`,
      });

      const response = await approveJobHandler(request, { params: Promise.resolve({ id: jobId }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.job).toBeDefined();
      expect(data.job.status).toBe('completed');
    });
  });

  describe('Credits', () => {
    test('GET /api/v1/credits/balance - Get balance', async () => {
      const request = createRequest('GET', '/api/v1/credits/balance', undefined, {
        Authorization: `Bearer ${workerToken}`,
      });

      const response = await creditsBalanceHandler(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.balance).toBeDefined();
      expect(typeof data.balance).toBe('number');
    });

    test('POST /api/v1/credits/purchase - Purchase credits', async () => {
      const request = createRequest('POST', '/api/v1/credits/purchase', {
        amount: 50,
        currency: 'INR',
      }, {
        Authorization: `Bearer ${workerToken}`,
      });

      const response = await purchaseCreditsHandler(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.payment_intent).toBeDefined();
    });
  });

  describe('Categories & Microtasks', () => {
    test('GET /api/v1/categories - List categories', async () => {
      const request = createRequest('GET', '/api/v1/categories');

      const response = await listCategoriesHandler(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.categories).toBeDefined();
      expect(Array.isArray(data.categories)).toBe(true);
    });

    test('GET /api/v1/categories/:id/microtasks - List microtasks', async () => {
      const request = createRequestWithParams('GET', `/api/v1/categories/${categoryId}/microtasks`, { id: categoryId });

      const response = await listMicrotasksHandler(request, { params: Promise.resolve({ id: categoryId }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.microtasks).toBeDefined();
      expect(Array.isArray(data.microtasks)).toBe(true);
    });
  });

  describe('Matching', () => {
    test('POST /api/v1/matching/auto-match - Auto-match workers', async () => {
      const request = createRequest('POST', '/api/v1/matching/auto-match', {
        job_id: jobId,
      }, {
        Authorization: `Bearer ${clientToken}`,
      });

      const response = await autoMatchHandler(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.matches).toBeDefined();
    });

    test('POST /api/v1/matching/suggest-workers - Suggest workers', async () => {
      const request = createRequest('POST', '/api/v1/matching/suggest-workers', {
        raw_text: 'Need a React developer with TypeScript experience',
      }, {
        Authorization: `Bearer ${clientToken}`,
      });

      const response = await suggestWorkersHandler(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.workers).toBeDefined();
    });
  });

  describe('Missing Tasks', () => {
    test('POST /api/v1/missing-tasks - Submit missing task request', async () => {
      const request = createRequest('POST', '/api/v1/missing-tasks', {
        raw_text: 'I need someone to build a custom AI chatbot integration',
      }, {
        Authorization: `Bearer ${clientToken}`,
      });

      const response = await missingTasksHandler(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.request).toBeDefined();
    });
  });

  describe('Admin', () => {
    test('GET /api/v1/admin/jobs - List all jobs (admin)', async () => {
      const request = createRequest('GET', '/api/v1/admin/jobs', undefined, {
        Authorization: `Bearer ${adminToken}`,
      });

      const response = await adminJobsHandler(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.jobs).toBeDefined();
    });

    test('GET /api/v1/admin/users - List all users (admin)', async () => {
      const request = createRequest('GET', '/api/v1/admin/users', undefined, {
        Authorization: `Bearer ${adminToken}`,
      });

      const response = await adminUsersHandler(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.users).toBeDefined();
    });
  });
});
