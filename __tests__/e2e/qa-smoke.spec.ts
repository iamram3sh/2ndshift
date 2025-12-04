/**
 * Smoke Tests - Must Pass Before Full Suite
 * Quick sanity checks for critical functionality
 */

import { test, expect } from '@playwright/test';

const PREVIEW_URL = process.env.PREVIEW_URL || 'https://2ndshift-git-revenue-system-v1-iamram3sh.vercel.app';
const PROD_URL = process.env.PROD_URL || 'https://2ndshift.vercel.app';
const TEST_URL = process.env.TEST_URL || (process.env.TEST_ENV === 'production' ? PROD_URL : PREVIEW_URL);

test.describe('Smoke Tests - Critical Paths', () => {
  test('SMOKE-1: Homepage loads (HTTP 200)', async ({ page }) => {
    const response = await page.goto(TEST_URL);
    expect(response?.status()).toBe(200);
  });

  test('SMOKE-2: Worker page loads', async ({ page }) => {
    const response = await page.goto(`${TEST_URL}/work?role=worker`);
    expect(response?.status()).toBe(200);
  });

  test('SMOKE-3: Client page loads', async ({ page }) => {
    const response = await page.goto(`${TEST_URL}/clients?role=client`);
    expect(response?.status()).toBe(200);
  });

  test('SMOKE-4: Homepage hero CTAs are visible', async ({ page }) => {
    await page.goto(TEST_URL);
    
    const workCTA = page.locator('text=I want to work').or(page.locator('button:has-text("I want to work")'));
    const hireCTA = page.locator('text=I want to hire').or(page.locator('button:has-text("I want to hire")'));

    await expect(workCTA.first()).toBeVisible({ timeout: 10000 });
    await expect(hireCTA.first()).toBeVisible({ timeout: 10000 });
  });

  test('SMOKE-5: Header logo exists and links to home', async ({ page }) => {
    await page.goto(`${TEST_URL}/work?role=worker`);
    
    const headerLogo = page.locator('header a[href="/"]').or(
      page.locator('header').locator('a').first()
    );

    const logoCount = await headerLogo.count();
    expect(logoCount).toBeGreaterThan(0);
  });
});
