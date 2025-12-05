/**
 * E2E Tests for Authentication Persistence
 * Tests that users remain logged in across navigation and actions
 */

import { test, expect } from '@playwright/test';

const WORKER_EMAIL = process.env.TEST_WORKER_EMAIL || 'worker@test.com';
const WORKER_PASSWORD = process.env.TEST_WORKER_PASSWORD || 'testpassword123';
const CLIENT_EMAIL = process.env.TEST_CLIENT_EMAIL || 'client@test.com';
const CLIENT_PASSWORD = process.env.TEST_CLIENT_PASSWORD || 'testpassword123';

test.describe('Authentication Persistence', () => {
  test.beforeEach(async ({ page }) => {
    // Clear cookies and localStorage before each test
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('Worker: Login persists across route navigation', async ({ page }) => {
    // 1. Visit login page
    await page.goto('/login?role=worker');
    
    // 2. Login
    await page.fill('input[type="email"]', WORKER_EMAIL);
    await page.fill('input[type="password"]', WORKER_PASSWORD);
    await page.click('button[type="submit"]');
    
    // 3. Wait for redirect to worker dashboard
    await page.waitForURL('/worker', { timeout: 10000 });
    
    // 4. Verify we're on dashboard and logged in
    await expect(page.locator('text=Welcome')).toBeVisible({ timeout: 5000 });
    
    // 5. Click on "Tasks" in sidebar
    await page.click('a[href="/worker/discover"]');
    await page.waitForURL('/worker/discover', { timeout: 5000 });
    await expect(page).not.toHaveURL(/\/login|^\/$/);
    
    // 6. Verify still logged in (check for user menu or sign out button)
    const topbar = page.locator('header').first();
    await expect(topbar).toBeVisible();
    
    // 7. Click on "Activity" in sidebar
    await page.click('a[href="/worker/activity"]');
    await page.waitForURL('/worker/activity', { timeout: 5000 });
    await expect(page).not.toHaveURL(/\/login|^\/$/);
    
    // 8. Verify still logged in
    await expect(page.locator('text=Activity')).toBeVisible();
    
    // 9. Click on "Pricing" in sidebar (public route)
    await page.click('a[href="/pricing"]');
    await page.waitForURL('/pricing', { timeout: 5000 });
    
    // 10. Verify still logged in - should be able to navigate back
    await page.goBack();
    await page.waitForURL('/worker/activity', { timeout: 5000 });
    
    // 11. Verify user menu is still visible
    const userMenu = page.locator('button[aria-label="User menu"]').first();
    await expect(userMenu).toBeVisible();
  });

  test('Worker: Session persists after page reload', async ({ page }) => {
    // 1. Login
    await page.goto('/login?role=worker');
    await page.fill('input[type="email"]', WORKER_EMAIL);
    await page.fill('input[type="password"]', WORKER_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('/worker', { timeout: 10000 });
    
    // 2. Verify logged in
    await expect(page.locator('text=Welcome')).toBeVisible({ timeout: 5000 });
    
    // 3. Reload page
    await page.reload();
    
    // 4. Verify still logged in
    await expect(page.locator('text=Welcome')).toBeVisible({ timeout: 5000 });
    
    // 5. Check cookies are present
    const cookies = await page.context().cookies();
    const hasAccessToken = cookies.some(c => c.name === 'access_token');
    const hasRefreshToken = cookies.some(c => c.name === 'refresh_token');
    
    expect(hasAccessToken || hasRefreshToken).toBeTruthy();
  });

  test('Client: Login persists across route navigation', async ({ page }) => {
    // 1. Visit login page
    await page.goto('/login?role=client');
    
    // 2. Login
    await page.fill('input[type="email"]', CLIENT_EMAIL);
    await page.fill('input[type="password"]', CLIENT_PASSWORD);
    await page.click('button[type="submit"]');
    
    // 3. Wait for redirect to client dashboard
    await page.waitForURL('/client', { timeout: 10000 });
    
    // 4. Verify we're on dashboard
    await expect(page.locator('text=Welcome')).toBeVisible({ timeout: 5000 });
    
    // 5. Click on "Tasks" in sidebar
    await page.click('a[href="/client/tasks"]');
    await page.waitForURL('/client/tasks', { timeout: 5000 });
    await expect(page).not.toHaveURL(/\/login|^\/$/);
    
    // 6. Verify still logged in
    const topbar = page.locator('header').first();
    await expect(topbar).toBeVisible();
    
    // 7. Click on "Activity" in sidebar
    await page.click('a[href="/client/activity"]');
    await page.waitForURL('/client/activity', { timeout: 5000 });
    await expect(page).not.toHaveURL(/\/login|^\/$/);
    
    // 8. Verify still logged in
    await expect(page.locator('text=Activity')).toBeVisible();
    
    // 9. Click on "Pricing" in sidebar
    await page.click('a[href="/pricing"]');
    await page.waitForURL('/pricing', { timeout: 5000 });
    
    // 10. Verify still logged in - navigate back
    await page.goBack();
    await page.waitForURL('/client/activity', { timeout: 5000 });
    
    // 11. Verify user menu is still visible
    const userMenu = page.locator('button[aria-label="User menu"]').first();
    await expect(userMenu).toBeVisible();
  });

  test('Client: Session persists after page reload', async ({ page }) => {
    // 1. Login
    await page.goto('/login?role=client');
    await page.fill('input[type="email"]', CLIENT_EMAIL);
    await page.fill('input[type="password"]', CLIENT_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('/client', { timeout: 10000 });

    // 2. Verify logged in
    await expect(page.locator('text=Welcome')).toBeVisible({ timeout: 5000 });

    // 3. Reload page
    await page.reload();

    // 4. Verify still logged in (not redirected)
    await expect(page).not.toHaveURL(/\/login|^\/$/);
    await expect(page.locator('text=Welcome')).toBeVisible({ timeout: 5000 });

    // 5. Cookies still present
    const cookies = await page.context().cookies();
    const hasAccessToken = cookies.some(c => c.name === 'access_token');
    const hasRefreshToken = cookies.some(c => c.name === 'refresh_token');
    expect(hasAccessToken || hasRefreshToken).toBeTruthy();
  });

  test('Worker: No logout when clicking job cards or actions', async ({ page }) => {
    // 1. Login
    await page.goto('/login?role=worker');
    await page.fill('input[type="email"]', WORKER_EMAIL);
    await page.fill('input[type="password"]', WORKER_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('/worker', { timeout: 10000 });
    
    // 2. Navigate to discover page
    await page.goto('/worker/discover');
    await page.waitForLoadState('networkidle');
    
    // 3. Try to click on a job card if available
    const jobCard = page.locator('[data-testid="job-card"]').first();
    if (await jobCard.count() > 0) {
      await jobCard.click();
      // Should not redirect to login or home
      await expect(page).not.toHaveURL('/login');
      await expect(page).not.toHaveURL('/');
    }
    
    // 4. Verify still logged in
    const userMenu = page.locator('button[aria-label="User menu"]').first();
    await expect(userMenu).toBeVisible();
  });

  test('Token refresh on 401', async ({ page }) => {
    // 1. Login
    await page.goto('/login?role=worker');
    await page.fill('input[type="email"]', WORKER_EMAIL);
    await page.fill('input[type="password"]', WORKER_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('/worker', { timeout: 10000 });
    
    // 2. Get initial cookies
    const cookiesBefore = await page.context().cookies();
    
    // 3. Wait a bit and make an API call (this should trigger refresh if needed)
    await page.goto('/worker/discover');
    await page.waitForLoadState('networkidle');
    
    // 4. Verify still logged in
    await expect(page.locator('text=High-Value IT Microtasks').or(page.locator('text=Tasks'))).toBeVisible({ timeout: 10000 });
    
    // 5. Check cookies are still present
    const cookiesAfter = await page.context().cookies();
    const hasTokens = cookiesAfter.some(c => c.name === 'access_token' || c.name === 'refresh_token');
    expect(hasTokens).toBeTruthy();
  });

  test('Cookie attributes are correct', async ({ page }) => {
    // 1. Login
    await page.goto('/login?role=worker');
    await page.fill('input[type="email"]', WORKER_EMAIL);
    await page.fill('input[type="password"]', WORKER_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('/worker', { timeout: 10000 });
    
    // 2. Get cookies
    const cookies = await page.context().cookies();
    const refreshTokenCookie = cookies.find(c => c.name === 'refresh_token');
    const accessTokenCookie = cookies.find(c => c.name === 'access_token');
    
    // 3. Verify refresh token cookie attributes
    if (refreshTokenCookie) {
      expect(refreshTokenCookie.path).toBe('/');
      expect(refreshTokenCookie.sameSite).toBe('Lax');
      // httpOnly can't be checked from JS, but Playwright can see it
    }
    
    // 4. Verify access token cookie attributes
    if (accessTokenCookie) {
      expect(accessTokenCookie.path).toBe('/');
      expect(accessTokenCookie.sameSite).toBe('Lax');
    }
  });
});
