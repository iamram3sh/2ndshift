/**
 * E2E Tests for Demo Flows
 * Tests complete job lifecycle end-to-end
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

test.describe('Demo E2E Flows', () => {
  let clientToken: string;
  let workerToken: string;
  let jobId: string;
  let applicationId: string;

  test('Complete Job Lifecycle', async ({ page, request }) => {
    // Step 1: Register Client
    console.log('Step 1: Registering client...');
    const clientEmail = `client-e2e-${Date.now()}@demo.2ndshift.com`;
    const clientResponse = await request.post(`${BASE_URL}/api/v1/auth/register`, {
      data: {
        role: 'client',
        email: clientEmail,
        password: 'password123',
        name: 'E2E Test Client',
      },
    });
    expect(clientResponse.ok()).toBeTruthy();
    const clientData = await clientResponse.json();
    clientToken = clientData.access_token;
    console.log('✅ Client registered');

    // Step 2: Register Worker
    console.log('Step 2: Registering worker...');
    const workerEmail = `worker-e2e-${Date.now()}@demo.2ndshift.com`;
    const workerResponse = await request.post(`${BASE_URL}/api/v1/auth/register`, {
      data: {
        role: 'worker',
        email: workerEmail,
        password: 'password123',
        name: 'E2E Test Worker',
      },
    });
    expect(workerResponse.ok()).toBeTruthy();
    const workerData = await workerResponse.json();
    workerToken = workerData.access_token;
    console.log('✅ Worker registered');

    // Initialize credits for worker
    await request.post(`${BASE_URL}/api/v1/credits/purchase`, {
      headers: { Authorization: `Bearer ${workerToken}` },
      data: { amount: 50, currency: 'INR' },
    });

    // Step 3: Get categories
    console.log('Step 3: Getting categories...');
    const categoriesResponse = await request.get(`${BASE_URL}/api/v1/categories`);
    expect(categoriesResponse.ok()).toBeTruthy();
    const categoriesData = await categoriesResponse.json();
    const categoryId = categoriesData.categories[0]?.id;
    expect(categoryId).toBeTruthy();
    console.log('✅ Categories fetched');

    // Step 4: Get microtasks
    console.log('Step 4: Getting microtasks...');
    const microtasksResponse = await request.get(`${BASE_URL}/api/v1/categories/${categoryId}/microtasks`);
    expect(microtasksResponse.ok()).toBeTruthy();
    const microtasksData = await microtasksResponse.json();
    const microtaskId = microtasksData.microtasks[0]?.id;
    expect(microtaskId).toBeTruthy();
    console.log('✅ Microtasks fetched');

    // Step 5: Client creates job
    console.log('Step 5: Client creating job...');
    const createJobResponse = await request.post(`${BASE_URL}/api/v1/jobs`, {
      headers: { Authorization: `Bearer ${clientToken}` },
      data: {
        title: 'E2E Test Job',
        description: 'Test job for E2E testing',
        category_id: categoryId,
        microtask_id: microtaskId,
        price_fixed: 5000,
        delivery_window: 'threeTo7d',
      },
    });
    expect(createJobResponse.ok()).toBeTruthy();
    const jobData = await createJobResponse.json();
    jobId = jobData.job.id;
    expect(jobId).toBeTruthy();
    console.log('✅ Job created');

    // Step 6: Worker applies to job
    console.log('Step 6: Worker applying to job...');
    const applyResponse = await request.post(`${BASE_URL}/api/v1/jobs/${jobId}/apply`, {
      headers: { Authorization: `Bearer ${workerToken}` },
      data: {
        cover_text: 'I am interested in this E2E test job',
        proposed_price: 4500,
      },
    });
    expect(applyResponse.ok()).toBeTruthy();
    const applyData = await applyResponse.json();
    applicationId = applyData.application.id;
    expect(applicationId).toBeTruthy();
    console.log('✅ Worker applied (credits deducted)');

    // Step 7: Client accepts proposal
    console.log('Step 7: Client accepting proposal...');
    const acceptResponse = await request.post(`${BASE_URL}/api/v1/jobs/${jobId}/accept-proposal`, {
      headers: { Authorization: `Bearer ${clientToken}` },
      data: { application_id: applicationId },
    });
    expect(acceptResponse.ok()).toBeTruthy();
    console.log('✅ Proposal accepted');

    // Step 8: Create escrow (demo payment)
    console.log('Step 8: Creating escrow with demo payment...');
    const escrowResponse = await request.post(`${BASE_URL}/api/payments/demo`, {
      data: {
        amount: 5000,
        currency: 'INR',
        description: 'Escrow funding for E2E test job',
      },
    });
    expect(escrowResponse.ok()).toBeTruthy();
    const escrowData = await escrowResponse.json();
    expect(escrowData.success).toBe(true);
    console.log('✅ Escrow funded (demo payment)');

    // Step 9: Worker delivers job
    console.log('Step 9: Worker delivering job...');
    const deliverResponse = await request.post(`${BASE_URL}/api/v1/jobs/${jobId}/deliver`, {
      headers: { Authorization: `Bearer ${workerToken}` },
      data: {
        delivery_notes: 'E2E test delivery completed',
        attachments: ['https://example.com/delivery.zip'],
      },
    });
    expect(deliverResponse.ok()).toBeTruthy();
    console.log('✅ Job delivered');

    // Step 10: Client approves job
    console.log('Step 10: Client approving job...');
    const approveResponse = await request.post(`${BASE_URL}/api/v1/jobs/${jobId}/approve`, {
      headers: { Authorization: `Bearer ${clientToken}` },
    });
    expect(approveResponse.ok()).toBeTruthy();
    const approveData = await approveResponse.json();
    expect(approveData.job.status).toBe('completed');
    console.log('✅ Job approved (escrow released, commission calculated)');

    console.log('\n🎉 Complete job lifecycle test passed!');
  });

  test('Credits Purchase Flow', async ({ request }) => {
    // Register worker
    const workerEmail = `worker-credits-${Date.now()}@demo.2ndshift.com`;
    const registerResponse = await request.post(`${BASE_URL}/api/v1/auth/register`, {
      data: {
        role: 'worker',
        email: workerEmail,
        password: 'password123',
        name: 'Credits Test Worker',
      },
    });
    expect(registerResponse.ok()).toBeTruthy();
    const registerData = await registerResponse.json();
    const token = registerData.access_token;

    // Check initial balance
    const balanceResponse = await request.get(`${BASE_URL}/api/v1/credits/balance`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(balanceResponse.ok()).toBeTruthy();
    const balanceData = await balanceResponse.json();
    const initialBalance = balanceData.balance || 0;

    // Purchase credits (demo)
    const purchaseResponse = await request.post(`${BASE_URL}/api/v1/credits/purchase`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { amount: 50, currency: 'INR' },
    });
    expect(purchaseResponse.ok()).toBeTruthy();
    const purchaseData = await purchaseResponse.json();
    expect(purchaseData.demo).toBe(true);
    expect(purchaseData.status).toBe('completed');

    // Verify balance increased
    const newBalanceResponse = await request.get(`${BASE_URL}/api/v1/credits/balance`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const newBalanceData = await newBalanceResponse.json();
    expect(newBalanceData.balance).toBeGreaterThan(initialBalance);
  });
});
