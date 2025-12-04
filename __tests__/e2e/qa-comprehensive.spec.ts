/**
 * Comprehensive QA Test Suite
 * Tests: Role separation, Navigation, CTAs, Accessibility, Performance
 */

import { test, expect, Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PREVIEW_URL = process.env.PREVIEW_URL || 'https://2ndshift-git-revenue-system-v1-iamram3sh.vercel.app';
const PROD_URL = process.env.PROD_URL || 'https://2ndshift.vercel.app';
const TEST_URL = process.env.TEST_URL || (process.env.TEST_ENV === 'production' ? PROD_URL : PREVIEW_URL);

const TEST_ACCOUNTS = {
  worker: { email: 'worker1@gmail.com', password: 'Test@1234' },
  client: { email: 'worker2@gmail.com', password: 'Test@1234' },
};

// Issue tracking
const issues: Array<{
  priority: 'P0' | 'P1';
  title: string;
  steps: string[];
  expected: string;
  actual: string;
  screenshot?: string;
  logs?: string[];
}> = [];

test.describe('QA Comprehensive Test Suite', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
  });

  test.describe('A. Smoke + Basic Pages', () => {
    test('A1: Homepage loads (HTTP 200)', async () => {
      const response = await page.goto(TEST_URL);
      expect(response?.status()).toBe(200);
      await page.screenshot({ path: 'qa-reports/screenshots/homepage.png', fullPage: true });
    });

    test('A2: Worker page loads', async () => {
      const response = await page.goto(`${TEST_URL}/work?role=worker`);
      expect(response?.status()).toBe(200);
      await page.screenshot({ path: 'qa-reports/screenshots/worker-page.png', fullPage: true });
    });

    test('A3: Client page loads', async () => {
      const response = await page.goto(`${TEST_URL}/clients?role=client`);
      expect(response?.status()).toBe(200);
      await page.screenshot({ path: 'qa-reports/screenshots/client-page.png', fullPage: true });
    });
  });

  test.describe('B. Role Separation & CTA Behavior - CRITICAL', () => {
    test('B1: Homepage hero CTAs are visible and distinct', async () => {
      await page.goto(TEST_URL);
      
      // Find hero CTAs
      const workCTA = page.locator('text=I want to work').or(page.locator('button:has-text("I want to work")'));
      const hireCTA = page.locator('text=I want to hire').or(page.locator('button:has-text("I want to hire")'));

      await expect(workCTA).toBeVisible({ timeout: 10000 });
      await expect(hireCTA).toBeVisible({ timeout: 10000 });

      // Check spacing (CSS gap or margin)
      const workBox = await workCTA.boundingBox();
      const hireBox = await hireCTA.boundingBox();
      
      if (workBox && hireBox) {
        const spacing = Math.abs(workBox.y - hireBox.y) > 0 
          ? Math.abs(workBox.y - hireBox.y) 
          : Math.abs(workBox.x - hireBox.x);
        
        if (spacing < 16) {
          issues.push({
            priority: 'P1',
            title: 'Hero CTAs spacing too small',
            steps: ['Navigate to homepage', 'Check spacing between CTAs'],
            expected: 'CTAs should have >= 16px spacing',
            actual: `Spacing is ${spacing}px`,
            screenshot: 'qa-reports/screenshots/cta-spacing-issue.png',
          });
          await page.screenshot({ path: 'qa-reports/screenshots/cta-spacing-issue.png' });
        }
      }

      // Check ARIA labels and keyboard focus
      const workAria = await workCTA.getAttribute('aria-label');
      const hireAria = await hireCTA.getAttribute('aria-label');
      
      if (!workAria && !hireAria) {
        issues.push({
          priority: 'P1',
          title: 'Hero CTAs missing ARIA labels',
          steps: ['Navigate to homepage', 'Check CTA buttons'],
          expected: 'CTAs should have aria-label attributes',
          actual: 'No aria-label found',
        });
      }

      // Test keyboard focus
      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => document.activeElement?.tagName);
      // Should be able to tab to CTAs
    });

    test('B2: Click "I want to work" navigates correctly and shows only worker UI', async () => {
      await page.goto(TEST_URL);
      
      const workCTA = page.locator('text=I want to work').or(page.locator('button:has-text("I want to work")'));
      await workCTA.click();

      // Wait for navigation
      await page.waitForURL(/\/work|\?role=worker/, { timeout: 5000 });

      // Check URL contains role=worker or /work
      const url = page.url();
      expect(url).toMatch(/\/work|\?role=worker/);

      // Check worker-specific elements are visible
      const workerElements = [
        page.locator('text=Get Remote Work').or(page.locator('text=Work that fits')),
        page.locator('text=worker').or(page.locator('[data-role="worker"]')),
      ];

      for (const element of workerElements) {
        const count = await element.count();
        if (count === 0) {
          // Not a failure, just checking
        }
      }

      // Check client-specific elements are NOT visible
      const clientElements = [
        page.locator('text=Post a Job').or(page.locator('text=Hire Talent')),
        page.locator('[data-role="client"]'),
      ];

      let clientElementsFound = false;
      for (const element of clientElements) {
        const count = await element.count();
        if (count > 0) {
          clientElementsFound = true;
          break;
        }
      }

      if (clientElementsFound) {
        issues.push({
          priority: 'P0',
          title: 'Worker page shows client-specific UI elements',
          steps: ['Navigate to homepage', 'Click "I want to work"', 'Check page content'],
          expected: 'Only worker-specific UI should be visible',
          actual: 'Client-specific elements found on worker page',
          screenshot: 'qa-reports/screenshots/worker-page-client-elements.png',
        });
        await page.screenshot({ path: 'qa-reports/screenshots/worker-page-client-elements.png', fullPage: true });
      }

      // Check home/back control exists
      const homeLink = page.locator('a[href="/"]').or(page.locator('text=Home'));
      const headerLogo = page.locator('header a[href="/"]').or(page.locator('header img[alt*="logo" i]'));
      
      const hasHomeControl = (await homeLink.count()) > 0 || (await headerLogo.count()) > 0;
      
      if (!hasHomeControl) {
        issues.push({
          priority: 'P0',
          title: 'Worker page missing home/back navigation',
          steps: ['Navigate to /work?role=worker', 'Check header for home link'],
          expected: 'Header should have logo or home link',
          actual: 'No home navigation found',
          screenshot: 'qa-reports/screenshots/worker-page-no-home.png',
        });
        await page.screenshot({ path: 'qa-reports/screenshots/worker-page-no-home.png' });
      }
    });

    test('B3: Click "I want to hire" navigates correctly and shows only client UI', async () => {
      await page.goto(TEST_URL);
      
      const hireCTA = page.locator('text=I want to hire').or(page.locator('button:has-text("I want to hire")'));
      await hireCTA.click();

      await page.waitForURL(/\/clients|\?role=client/, { timeout: 5000 });

      const url = page.url();
      expect(url).toMatch(/\/clients|\?role=client/);

      // Check client-specific elements
      const clientElements = [
        page.locator('text=Post a Job').or(page.locator('text=Hire Talent')),
        page.locator('text=pricing').or(page.locator('[data-role="client"]')),
      ];

      // Check worker-specific elements are NOT visible
      const workerElements = [
        page.locator('text=Apply to Jobs').or(page.locator('text=Find Work')),
        page.locator('[data-role="worker"]'),
      ];

      let workerElementsFound = false;
      for (const element of workerElements) {
        const count = await element.count();
        if (count > 0) {
          workerElementsFound = true;
          break;
        }
      }

      if (workerElementsFound) {
        issues.push({
          priority: 'P0',
          title: 'Client page shows worker-specific UI elements',
          steps: ['Navigate to homepage', 'Click "I want to hire"', 'Check page content'],
          expected: 'Only client-specific UI should be visible',
          actual: 'Worker-specific elements found on client page',
          screenshot: 'qa-reports/screenshots/client-page-worker-elements.png',
        });
        await page.screenshot({ path: 'qa-reports/screenshots/client-page-worker-elements.png', fullPage: true });
      }

      // Check home control
      const homeLink = page.locator('a[href="/"]').or(page.locator('text=Home'));
      const headerLogo = page.locator('header a[href="/"]');
      
      const hasHomeControl = (await homeLink.count()) > 0 || (await headerLogo.count()) > 0;
      
      if (!hasHomeControl) {
        issues.push({
          priority: 'P0',
          title: 'Client page missing home/back navigation',
          steps: ['Navigate to /clients?role=client', 'Check header for home link'],
          expected: 'Header should have logo or home link',
          actual: 'No home navigation found',
          screenshot: 'qa-reports/screenshots/client-page-no-home.png',
        });
        await page.screenshot({ path: 'qa-reports/screenshots/client-page-no-home.png' });
      }
    });
  });

  test.describe('C. Navigation & Links - CRITICAL', () => {
    test('C1: Header logo navigates to homepage', async () => {
      await page.goto(`${TEST_URL}/work?role=worker`);
      
      const headerLogo = page.locator('header a[href="/"]').or(
        page.locator('header img[alt*="logo" i]').locator('..')
      ).first();

      if (await headerLogo.count() > 0) {
        await headerLogo.click();
        await page.waitForURL(new RegExp(`^${TEST_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/?$`), { timeout: 5000 });
        
        const response = await page.goto(page.url());
        expect(response?.status()).toBe(200);
      } else {
        issues.push({
          priority: 'P0',
          title: 'Header logo missing or not linked to homepage',
          steps: ['Navigate to any page', 'Check header for logo link'],
          expected: 'Header should have clickable logo linking to /',
          actual: 'No header logo link found',
          screenshot: 'qa-reports/screenshots/no-header-logo.png',
        });
        await page.screenshot({ path: 'qa-reports/screenshots/no-header-logo.png' });
      }
    });

    test('C2: No 404s on header/footer links', async () => {
      await page.goto(TEST_URL);
      
      const headerLinks = page.locator('header a[href^="/"]');
      const footerLinks = page.locator('footer a[href^="/"]');
      
      const allLinks = [...await headerLinks.all(), ...await footerLinks.all()];
      const linkHrefs = await Promise.all(
        allLinks.map(link => link.getAttribute('href'))
      );

      const failures: string[] = [];
      
      for (const href of linkHrefs) {
        if (!href) continue;
        
        try {
          const response = await page.goto(`${TEST_URL}${href}`);
          if (response && response.status() === 404) {
            failures.push(href);
          }
        } catch (error) {
          // Skip external links
        }
      }

      if (failures.length > 0) {
        issues.push({
          priority: 'P0',
          title: 'Header/footer links return 404',
          steps: ['Navigate to homepage', 'Click header/footer links'],
          expected: 'All internal links should return 200',
          actual: `404s found: ${failures.join(', ')}`,
          screenshot: 'qa-reports/screenshots/404-links.png',
        });
      }
    });

    test('C3: Browser back button works correctly', async () => {
      await page.goto(TEST_URL);
      await page.goto(`${TEST_URL}/work?role=worker`);
      await page.goBack();
      
      await page.waitForURL(new RegExp(`^${TEST_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/?$`), { timeout: 5000 });
      
      const url = page.url();
      expect(url).toMatch(new RegExp(`^${TEST_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/?$`));
    });
  });

  test.describe('D. Hero CTA Styling & Accessibility', () => {
    test('D1: Hero CTAs have proper ARIA labels and keyboard focus', async () => {
      await page.goto(TEST_URL);
      
      const workCTA = page.locator('text=I want to work').or(page.locator('button:has-text("I want to work")'));
      const hireCTA = page.locator('text=I want to hire').or(page.locator('button:has-text("I want to hire")'));

      // Test keyboard navigation
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      const focusedElement = await page.evaluate(() => {
        const active = document.activeElement;
        return active ? {
          tag: active.tagName,
          text: active.textContent?.trim(),
          ariaLabel: active.getAttribute('aria-label'),
        } : null;
      });

      if (!focusedElement || (!focusedElement.text?.includes('work') && !focusedElement.text?.includes('hire'))) {
        issues.push({
          priority: 'P1',
          title: 'Hero CTAs not keyboard focusable',
          steps: ['Navigate to homepage', 'Press Tab key multiple times'],
          expected: 'CTAs should be focusable via keyboard',
          actual: 'CTAs not reachable via Tab',
        });
      }
    });

    test('D2: Hero text is readable (no overlay hiding content)', async () => {
      await page.goto(TEST_URL);
      
      // Check hero heading visibility
      const heroHeading = page.locator('h1').first();
      await expect(heroHeading).toBeVisible();
      
      // Check text color contrast
      const headingColor = await heroHeading.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return {
          color: style.color,
          backgroundColor: style.backgroundColor,
        };
      });

      // Take screenshot to verify visually
      await page.screenshot({ path: 'qa-reports/screenshots/hero-readability.png', fullPage: true });
      
      // Check if text is white on dark background (should be readable)
      const isReadable = headingColor.color.includes('rgb(255') || headingColor.color.includes('#fff');
      
      if (!isReadable) {
        issues.push({
          priority: 'P1',
          title: 'Hero heading may have contrast issues',
          steps: ['Navigate to homepage', 'Check hero heading visibility'],
          expected: 'Hero heading should be clearly visible',
          actual: `Heading color: ${headingColor.color}`,
          screenshot: 'qa-reports/screenshots/hero-readability.png',
        });
      }
    });
  });

  test.describe('E. Category Pages & Microtask Cards', () => {
    test('E1: Category hero displays H1 and CTA', async () => {
      const categories = ['devops', 'cloud', 'networking', 'ai', 'database', 'programming'];
      
      for (const category of categories) {
        await page.goto(`${TEST_URL}/category/${category}`);
        
        const h1 = page.locator('h1').first();
        await expect(h1).toBeVisible({ timeout: 5000 });
        
        // Check H1 is readable
        const h1Color = await h1.evaluate((el) => window.getComputedStyle(el).color);
        const isReadable = h1Color.includes('rgb(255') || h1Color.includes('#fff');
        
        if (!isReadable) {
          issues.push({
            priority: 'P1',
            title: `Category ${category} hero H1 not readable`,
            steps: [`Navigate to /category/${category}`, 'Check H1 visibility'],
            expected: 'H1 should be clearly visible',
            actual: `H1 color: ${h1Color}`,
            screenshot: `qa-reports/screenshots/category-${category}-hero.png`,
          });
          await page.screenshot({ path: `qa-reports/screenshots/category-${category}-hero.png`, fullPage: true });
        }

        // Check for CTA
        const cta = page.locator('text=Post').or(page.locator('button:has-text("Post")'));
        const ctaCount = await cta.count();
        
        if (ctaCount === 0) {
          issues.push({
            priority: 'P1',
            title: `Category ${category} missing CTA`,
            steps: [`Navigate to /category/${category}`, 'Check for Post Task CTA'],
            expected: 'Category page should have Post Task CTA',
            actual: 'No CTA found',
          });
        }
      }
    });

    test('E2: Microtask cards are present and legible', async () => {
      await page.goto(`${TEST_URL}/category/devops`);
      
      // Look for microtask cards (various possible selectors)
      const cards = page.locator('[class*="card"]').or(
        page.locator('[class*="microtask"]')
      );

      const cardCount = await cards.count();
      
      if (cardCount === 0) {
        issues.push({
          priority: 'P1',
          title: 'Category page missing microtask cards',
          steps: ['Navigate to /category/devops', 'Check for microtask cards'],
          expected: 'Category page should show microtask cards',
          actual: 'No cards found',
          screenshot: 'qa-reports/screenshots/no-microtask-cards.png',
        });
        await page.screenshot({ path: 'qa-reports/screenshots/no-microtask-cards.png', fullPage: true });
      }
    });
  });

  test.describe('F. Accessibility Tests', () => {
    test('F1: Homepage accessibility (axe)', async () => {
      await page.goto(TEST_URL);
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      const criticalViolations = accessibilityScanResults.violations.filter((v: any) => 
        v.impact === 'critical' || v.impact === 'serious'
      );

      if (criticalViolations.length > 0) {
        issues.push({
          priority: 'P1',
          title: 'Homepage accessibility violations found',
          steps: ['Navigate to homepage', 'Run axe accessibility check'],
          expected: 'No critical accessibility violations',
          actual: `${criticalViolations.length} critical violations found`,
          logs: JSON.stringify(criticalViolations, null, 2),
        });
      }
    });
  });

  test.describe('G. Login & Registration', () => {
    test('G1: Login page loads and form is accessible', async () => {
      await page.goto(`${TEST_URL}/login`);
      
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      const submitButton = page.locator('button[type="submit"]');

      await expect(emailInput).toBeVisible();
      await expect(passwordInput).toBeVisible();
      await expect(submitButton).toBeVisible();

      // Test keyboard navigation
      await emailInput.focus();
      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => document.activeElement?.tagName);
      expect(focused).toBe('INPUT');
    });

    test('G2: Registration page loads', async () => {
      const response = await page.goto(`${TEST_URL}/register`);
      expect(response?.status()).toBe(200);
      
      await page.screenshot({ path: 'qa-reports/screenshots/register-page.png', fullPage: true });
    });
  });

  test.afterAll(async () => {
    // Generate issues JSON
    const fs = require('fs');
    const path = require('path');
    
    const issuesDir = path.join(process.cwd(), 'qa-reports');
    if (!fs.existsSync(issuesDir)) {
      fs.mkdirSync(issuesDir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(issuesDir, 'issues.json'),
      JSON.stringify(issues, null, 2)
    );

    // Generate summary
    const p0Count = issues.filter(i => i.priority === 'P0').length;
    const p1Count = issues.filter(i => i.priority === 'P1').length;

    const summary = `# QA Test Summary

## Test Execution
- **Date:** ${new Date().toISOString()}
- **Environment:** ${TEST_URL}
- **Test URL:** ${TEST_URL}

## Results
- **P0 Issues:** ${p0Count}
- **P1 Issues:** ${p1Count}
- **Total Issues:** ${issues.length}

## Critical Issues (P0)
${p0Count > 0 ? issues.filter(i => i.priority === 'P0').map(i => `- [P0] ${i.title}`).join('\n') : 'None ✅'}

## High Priority Issues (P1)
${p1Count > 0 ? issues.filter(i => i.priority === 'P1').map(i => `- [P1] ${i.title}`).join('\n') : 'None ✅'}

## Detailed Issues
See \`qa-reports/issues.json\` for full details.

## Screenshots
All screenshots saved to \`qa-reports/screenshots/\`

## Next Steps
${p0Count > 0 ? '**BLOCKING:** P0 issues must be fixed before production deployment.' : 'No blocking issues. Review P1 issues for improvements.'}
`;

    fs.writeFileSync(path.join(issuesDir, 'summary.md'), summary);
  });
});
