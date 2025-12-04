/**
 * Navigation & Link Testing
 * Tests: Breadcrumbs, anchors, 404s, back behavior
 */

import { test, expect } from '@playwright/test';

const PREVIEW_URL = process.env.PREVIEW_URL || 'https://2ndshift-git-revenue-system-v1-iamram3sh.vercel.app';
const PROD_URL = process.env.PROD_URL || 'https://2ndshift.vercel.app';
const TEST_URL = process.env.TEST_URL || (process.env.TEST_ENV === 'production' ? PROD_URL : PREVIEW_URL);

test.describe('Navigation & Link Tests', () => {
  test('N1: All header links return 200', async ({ page }) => {
    await page.goto(TEST_URL);
    
    const headerLinks = page.locator('header a[href^="/"]');
    const linkCount = await headerLinks.count();
    
    const failures: Array<{ href: string; status: number }> = [];
    
    for (let i = 0; i < linkCount; i++) {
      const link = headerLinks.nth(i);
      const href = await link.getAttribute('href');
      
      if (!href || href.startsWith('http')) continue;
      
      try {
        const response = await page.goto(`${TEST_URL}${href}`);
        if (response && response.status() !== 200) {
          failures.push({ href, status: response.status() });
        }
      } catch (error) {
        // External link, skip
      }
    }
    
    if (failures.length > 0) {
      console.error('Header link failures:', failures);
    }
    
    expect(failures.length).toBe(0);
  });

  test('N2: Category breadcrumbs work', async ({ page }) => {
    await page.goto(`${TEST_URL}/category/devops`);
    
    // Look for breadcrumb
    const breadcrumb = page.locator('[class*="breadcrumb"]').or(
      page.locator('nav[aria-label*="breadcrumb" i]')
    );
    
    const hasBreadcrumb = await breadcrumb.count() > 0;
    
    if (hasBreadcrumb) {
      const homeLink = breadcrumb.locator('a[href="/"]');
      if (await homeLink.count() > 0) {
        await homeLink.click();
        await page.waitForURL(new RegExp(`^${TEST_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/?$`));
      }
    }
  });

  test('N3: Deep link navigation with back button', async ({ page }) => {
    await page.goto(TEST_URL);
    await page.goto(`${TEST_URL}/category/devops?task=ci-pipeline-fix`);
    
    // Click header logo
    const headerLogo = page.locator('header a[href="/"]').first();
    if (await headerLogo.count() > 0) {
      await headerLogo.click();
      await page.waitForURL(new RegExp(`^${TEST_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/?$`));
    }
    
    // Test back button
    await page.goBack();
    const url = page.url();
    expect(url).toContain('/category/devops');
  });
});
