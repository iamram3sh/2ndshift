/**
 * Comprehensive API Testing Script
 * Tests all API endpoints and generates a report
 */

import { supabaseAdmin } from '@/lib/supabase/admin';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const API_BASE = `${BASE_URL}/api/v1`;

interface TestResult {
  endpoint: string;
  method: string;
  status: 'pass' | 'fail' | 'skip';
  statusCode?: number;
  error?: string;
  duration?: number;
}

const results: TestResult[] = [];
let clientToken = '';
let workerToken = '';
let adminToken = '';
let clientId = '';
let workerId = '';
let adminId = '';
let categoryId = '';
let microtaskId = '';
let jobId = '';
let applicationId = '';

async function makeRequest(
  endpoint: string,
  method: string = 'GET',
  body?: any,
  token?: string
): Promise<{ status: number; data: any; duration: number }> {
  const startTime = Date.now();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json().catch(() => ({}));
    const duration = Date.now() - startTime;

    return { status: response.status, data, duration };
  } catch (error: any) {
    return {
      status: 0,
      data: { error: error.message },
      duration: Date.now() - startTime,
    };
  }
}

function recordResult(endpoint: string, method: string, status: number, error?: string, duration?: number) {
  results.push({
    endpoint,
    method,
    status: status >= 200 && status < 300 ? 'pass' : 'fail',
    statusCode: status,
    error,
    duration,
  });
}

async function setupTestData() {
  console.log('🔧 Setting up test data...');

  // Create test category
  const { data: category } = await supabaseAdmin
    .from('categories')
    .upsert({
      slug: 'test-api-category',
      name: 'Test API Category',
      description: 'Category for API testing',
      is_active: true,
    }, { onConflict: 'slug' })
    .select()
    .single();
  categoryId = category?.id || '';

  // Create test microtask
  const { data: microtask } = await supabaseAdmin
    .from('microtasks')
    .upsert({
      title: 'Test API Microtask',
      slug: 'test-api-microtask',
      description: 'Microtask for API testing',
      category_id: categoryId,
      complexity: 'intermediate',
      delivery_window: 'threeTo7d',
      base_price_min: 1000,
      base_price_max: 5000,
    }, { onConflict: 'slug' })
    .select()
    .single();
  microtaskId = microtask?.id || '';

  console.log('✅ Test data setup complete');
}

async function cleanupTestData() {
  console.log('🧹 Cleaning up test data...');

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

  console.log('✅ Cleanup complete');
}

async function testAuthentication() {
  console.log('\n📝 Testing Authentication Endpoints...');

  // Register client
  const timestamp = Date.now();
  const clientEmail = `test-client-${timestamp}@example.com`;
  const { status: regClientStatus, data: regClientData, duration: regClientDuration } = await makeRequest(
    '/auth/register',
    'POST',
    {
      role: 'client',
      email: clientEmail,
      password: 'password123',
      name: 'Test Client',
    }
  );
  recordResult('/auth/register (client)', 'POST', regClientStatus, undefined, regClientDuration);
  if (regClientStatus === 200) {
    clientToken = regClientData.access_token;
    clientId = regClientData.user.id;
  }

  // Register worker
  const workerEmail = `test-worker-${timestamp}@example.com`;
  const { status: regWorkerStatus, data: regWorkerData, duration: regWorkerDuration } = await makeRequest(
    '/auth/register',
    'POST',
    {
      role: 'worker',
      email: workerEmail,
      password: 'password123',
      name: 'Test Worker',
    }
  );
  recordResult('/auth/register (worker)', 'POST', regWorkerStatus, undefined, regWorkerDuration);
  if (regWorkerStatus === 200) {
    workerToken = regWorkerData.access_token;
    workerId = regWorkerData.user.id;
    // Initialize credits
    await supabaseAdmin
      .from('shift_credits')
      .upsert({
        user_id: workerId,
        balance: 100,
        reserved: 0,
      });
  }

  // Register admin
  const adminEmail = `test-admin-${timestamp}@example.com`;
  const { status: regAdminStatus, data: regAdminData, duration: regAdminDuration } = await makeRequest(
    '/auth/register',
    'POST',
    {
      role: 'admin',
      email: adminEmail,
      password: 'password123',
      name: 'Test Admin',
    }
  );
  recordResult('/auth/register (admin)', 'POST', regAdminStatus, undefined, regAdminDuration);
  if (regAdminStatus === 200) {
    adminToken = regAdminData.access_token;
    adminId = regAdminData.user.id;
  }

  // Login
  const { status: loginStatus, duration: loginDuration } = await makeRequest(
    '/auth/login',
    'POST',
    {
      email: clientEmail,
      password: 'password123',
    }
  );
  recordResult('/auth/login', 'POST', loginStatus, undefined, loginDuration);

  // Get current user
  const { status: meStatus, duration: meDuration } = await makeRequest('/auth/me', 'GET', undefined, clientToken);
  recordResult('/auth/me', 'GET', meStatus, undefined, meDuration);
}

async function testJobs() {
  console.log('\n💼 Testing Jobs Endpoints...');

  // Create job
  const { status: createStatus, data: createData, duration: createDuration } = await makeRequest(
    '/jobs',
    'POST',
    {
      title: 'Test API Job',
      description: 'Test job for API testing',
      category_id: categoryId,
      microtask_id: microtaskId,
      price_fixed: 5000,
      delivery_window: 'threeTo7d',
    },
    clientToken
  );
  recordResult('/jobs (create)', 'POST', createStatus, undefined, createDuration);
  if (createStatus === 201) {
    jobId = createData.job.id;
  }

  // List jobs
  const { status: listStatus, duration: listDuration } = await makeRequest('/jobs?status=open', 'GET', undefined, clientToken);
  recordResult('/jobs (list)', 'GET', listStatus, undefined, listDuration);

  // Get job details
  if (jobId) {
    const { status: getStatus, duration: getDuration } = await makeRequest(`/jobs/${jobId}`, 'GET', undefined, clientToken);
    recordResult('/jobs/:id', 'GET', getStatus, undefined, getDuration);

    // Apply to job
    const { status: applyStatus, data: applyData, duration: applyDuration } = await makeRequest(
      `/jobs/${jobId}/apply`,
      'POST',
      {
        cover_text: 'I am interested in this job',
        proposed_price: 4500,
      },
      workerToken
    );
    recordResult('/jobs/:id/apply', 'POST', applyStatus, undefined, applyDuration);
    if (applyStatus === 201) {
      applicationId = applyData.application.id;
    }

    // Accept proposal
    if (applicationId) {
      const { status: acceptStatus, duration: acceptDuration } = await makeRequest(
        `/jobs/${jobId}/accept-proposal`,
        'POST',
        { application_id: applicationId },
        clientToken
      );
      recordResult('/jobs/:id/accept-proposal', 'POST', acceptStatus, undefined, acceptDuration);

      // Deliver job
      const { status: deliverStatus, duration: deliverDuration } = await makeRequest(
        `/jobs/${jobId}/deliver`,
        'POST',
        {
          delivery_notes: 'Job completed',
          attachments: ['https://example.com/file.zip'],
        },
        workerToken
      );
      recordResult('/jobs/:id/deliver', 'POST', deliverStatus, undefined, deliverDuration);

      // Create escrow for approval
      await supabaseAdmin
        .from('escrows')
        .upsert({
          job_id: jobId,
          client_id: clientId,
          amount: 5000,
          currency: 'INR',
          status: 'funded',
        });

      // Approve job
      const { status: approveStatus, duration: approveDuration } = await makeRequest(
        `/jobs/${jobId}/approve`,
        'POST',
        undefined,
        clientToken
      );
      recordResult('/jobs/:id/approve', 'POST', approveStatus, undefined, approveDuration);
    }
  }
}

async function testCredits() {
  console.log('\n💰 Testing Credits Endpoints...');

  // Get balance
  const { status: balanceStatus, duration: balanceDuration } = await makeRequest('/credits/balance', 'GET', undefined, workerToken);
  recordResult('/credits/balance', 'GET', balanceStatus, undefined, balanceDuration);

  // Purchase credits
  const { status: purchaseStatus, duration: purchaseDuration } = await makeRequest(
    '/credits/purchase',
    'POST',
    { amount: 50, currency: 'INR' },
    workerToken
  );
  recordResult('/credits/purchase', 'POST', purchaseStatus, undefined, purchaseDuration);
}

async function testCategories() {
  console.log('\n📂 Testing Categories Endpoints...');

  // List categories
  const { status: listStatus, duration: listCatDuration } = await makeRequest('/categories', 'GET');
  recordResult('/categories', 'GET', listStatus, undefined, listCatDuration);

  // List microtasks
  if (categoryId) {
    const { status: microtasksStatus, duration: microtasksDuration } = await makeRequest(
      `/categories/${categoryId}/microtasks`,
      'GET'
    );
    recordResult('/categories/:id/microtasks', 'GET', microtasksStatus, undefined, microtasksDuration);
  }
}

async function testMatching() {
  console.log('\n🔍 Testing Matching Endpoints...');

  if (jobId) {
    // Auto-match
    const { status: autoMatchStatus, duration: autoMatchDuration } = await makeRequest(
      '/matching/auto-match',
      'POST',
      { job_id: jobId },
      clientToken
    );
    recordResult('/matching/auto-match', 'POST', autoMatchStatus, undefined, autoMatchDuration);
  }

  // Suggest workers
  const { status: suggestStatus, duration: suggestDuration } = await makeRequest(
    '/matching/suggest-workers',
    'POST',
    { raw_text: 'Need a React developer' },
    clientToken
  );
  recordResult('/matching/suggest-workers', 'POST', suggestStatus, undefined, suggestDuration);
}

async function testMissingTasks() {
  console.log('\n🔎 Testing Missing Tasks Endpoints...');

  const { status, duration: missingTasksDuration } = await makeRequest(
    '/missing-tasks',
    'POST',
    { raw_text: 'I need a custom AI chatbot integration' },
    clientToken
  );
  recordResult('/missing-tasks', 'POST', status, undefined, missingTasksDuration);
}

async function testAdmin() {
  console.log('\n👑 Testing Admin Endpoints...');

  // List all jobs
  const { status: jobsStatus, duration: adminJobsDuration } = await makeRequest('/admin/jobs', 'GET', undefined, adminToken);
  recordResult('/admin/jobs', 'GET', jobsStatus, undefined, adminJobsDuration);

  // List all users
  const { status: usersStatus, duration: adminUsersDuration } = await makeRequest('/admin/users', 'GET', undefined, adminToken);
  recordResult('/admin/users', 'GET', usersStatus, undefined, adminUsersDuration);
}

function generateReport() {
  console.log('\n' + '='.repeat(80));
  console.log('📊 API TEST REPORT');
  console.log('='.repeat(80));

  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;
  const total = results.length;

  console.log(`\nTotal Tests: ${total}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

  console.log('\n' + '-'.repeat(80));
  console.log('DETAILED RESULTS');
  console.log('-'.repeat(80));

  results.forEach(result => {
    const icon = result.status === 'pass' ? '✅' : '❌';
    const duration = result.duration ? ` (${result.duration}ms)` : '';
    console.log(
      `${icon} ${result.method.padEnd(6)} ${result.endpoint.padEnd(50)} ${result.statusCode || 'ERROR'}${duration}`
    );
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  });

  console.log('\n' + '='.repeat(80));

  if (failed === 0) {
    console.log('🎉 All tests passed!');
  } else {
    console.log(`⚠️  ${failed} test(s) failed. Please review the errors above.`);
  }
}

async function main() {
  console.log('🚀 Starting Comprehensive API Tests...');
  console.log(`Base URL: ${API_BASE}\n`);

  try {
    await setupTestData();
    await testAuthentication();
    await testJobs();
    await testCredits();
    await testCategories();
    await testMatching();
    await testMissingTasks();
    await testAdmin();
    generateReport();
  } catch (error: any) {
    console.error('❌ Test execution failed:', error.message);
    process.exit(1);
  } finally {
    await cleanupTestData();
  }
}

main();
