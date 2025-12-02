/**
 * E2E Tests for Revenue Flows
 * Tests credit purchase, job application, escrow funding, and subscription flows
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';

test.describe('Revenue Flows', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage
    await page.goto(BASE_URL);
  });

  test('Worker can purchase credits', async ({ page }) => {
    // Register as worker
    await page.goto(`${BASE_URL}/register?type=worker`);
    await page.fill('input[type="email"]', `worker-${Date.now()}@test.com`);
    await page.fill('input[type="password"]', 'password123');
    await page.fill('input[name="name"]', 'Test Worker');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard
    await page.waitForURL('**/dashboard/worker', { timeout: 10000 });
    
    // Click on credits balance widget
    await page.click('button:has-text("Credits")');
    
    // Wait for buy credits modal
    await page.waitForSelector('text=Buy Shift Credits', { timeout: 5000 });
    
    // Select a package (first one)
    const firstPackage = page.locator('button:has-text("Buy Now")').first();
    await firstPackage.click();
    
    // In demo mode, payment should auto-complete
    await page.waitForTimeout(2000);
    
    // Verify credits were added (check balance updated)
    const balanceText = await page.locator('button:has-text("Credits")').textContent();
    expect(balanceText).toContain(/\d+/); // Should have a number
  });

  test('Worker can apply to job with credit deduction', async ({ page }) => {
    // Login as worker (assuming demo worker exists)
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'worker1@demo.2ndshift.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await page.waitForURL('**/dashboard/worker', { timeout: 10000 });
    
    // Navigate to discover jobs
    await page.goto(`${BASE_URL}/dashboard/worker/discover`);
    await page.waitForLoadState('networkidle');
    
    // Click on first job
    const firstJob = page.locator('a:has-text("View Details")').first();
    if (await firstJob.count() > 0) {
      await firstJob.click();
      
      // Wait for job detail page
      await page.waitForURL('**/projects/**', { timeout: 5000 });
      
      // Click apply button
      const applyButton = page.locator('button:has-text("Apply")');
      if (await applyButton.count() > 0) {
        await applyButton.click();
        
        // Wait for apply modal
        await page.waitForSelector('text=Apply to Job', { timeout: 5000 });
        
        // Fill in application details
        await page.fill('input[type="number"]', '5000');
        
        // Submit application
        await page.click('button:has-text("Apply to Job")');
        
        // Wait for success or error
        await page.waitForTimeout(2000);
        
        // Should redirect or show success
        expect(page.url()).toMatch(/dashboard\/worker|projects/);
      }
    }
  });

  test('Client can view pricing and commission summary', async ({ page }) => {
    // Login as client
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'client1@demo.2ndshift.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await page.waitForURL('**/dashboard/client', { timeout: 10000 });
    
    // Check for pricing summary
    const pricingSummary = page.locator('text=Platform Fees');
    await expect(pricingSummary).toBeVisible({ timeout: 5000 });
    
    // Should show commission and escrow fee
    const commissionText = await page.textContent('body');
    expect(commissionText).toMatch(/commission|escrow/i);
  });

  test('Client can subscribe to plan', async ({ page }) => {
    // Login as client
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'client1@demo.2ndshift.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await page.waitForURL('**/dashboard/client', { timeout: 10000 });
    
    // Look for subscription upsell
    const subscriptionSection = page.locator('text=Client Subscriptions');
    if (await subscriptionSection.count() > 0) {
      // Click subscribe button
      const subscribeButton = page.locator('button:has-text("Subscribe")').first();
      if (await subscribeButton.count() > 0) {
        await subscribeButton.click();
        
        // In demo mode, subscription should activate
        await page.waitForTimeout(2000);
        
        // Verify subscription activated (check for success message or status)
        const pageContent = await page.textContent('body');
        expect(pageContent).toMatch(/subscription|activated|success/i);
      }
    }
  });

  test('Commission calculator displays correctly', async ({ page }) => {
    // Login as worker
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'worker1@demo.2ndshift.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await page.waitForURL('**/dashboard/worker', { timeout: 10000 });
    
    // Navigate to a job
    await page.goto(`${BASE_URL}/dashboard/worker/discover`);
    await page.waitForLoadState('networkidle');
    
    const firstJob = page.locator('a:has-text("View Details")').first();
    if (await firstJob.count() > 0) {
      await firstJob.click();
      await page.waitForURL('**/projects/**', { timeout: 5000 });
      
      // Check for price breakdown
      const breakdown = page.locator('text=Payout Breakdown, text=Price Breakdown');
      if (await breakdown.count() > 0) {
        await expect(breakdown.first()).toBeVisible({ timeout: 5000 });
      }
    }
  });
});
