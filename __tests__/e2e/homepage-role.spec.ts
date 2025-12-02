/**
 * E2E Tests for Homepage Role Selection
 * 
 * To run these tests, install Playwright:
 * npm install --save-dev @playwright/test
 * npx playwright install
 * 
 * Run tests: npx playwright test
 */

import { test, expect } from '@playwright/test'

test.describe('Homepage Role Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('clicking "I want to work" navigates to /work and shows worker content', async ({ page }) => {
    // Click the worker button
    await page.click('button:has-text("I Want to Work")')
    
    // Wait for navigation to /work
    await page.waitForURL(/\/work/)
    
    // Verify worker hero content is visible
    await expect(page.locator('text=Earn from Anywhere')).toBeVisible()
    
    // Verify client hero content is NOT present (check for data-role attribute)
    const clientSections = page.locator('[data-role="client"]')
    await expect(clientSections).toHaveCount(0)
    
    // Verify worker opportunities section is visible
    await expect(page.locator('text=Work that fits your life')).toBeVisible()
    
    // Verify worker-specific modules are present
    await expect(page.locator('text=Quick-start opportunities')).toBeVisible()
    await expect(page.locator('text=Stand out with verified badges')).toBeVisible()
    
    // Verify client opportunities section is NOT present
    await expect(page.locator('text=Ready to hire talent?')).not.toBeVisible()
  })

  test('clicking "I want to hire" navigates to /clients and shows client content', async ({ page }) => {
    // Click the client button
    await page.click('button:has-text("I Want to Hire")')
    
    // Wait for navigation to /clients
    await page.waitForURL(/\/clients/)
    
    // Verify client hero content is visible
    await expect(page.locator('text=Hire Talent Fast')).toBeVisible()
    
    // Verify worker hero content is NOT present
    const workerSections = page.locator('[data-role="worker"]')
    await expect(workerSections).toHaveCount(0)
    
    // Verify client opportunities section is visible
    await expect(page.locator('text=Ready to hire talent?')).toBeVisible()
    
    // Verify client-specific modules are present
    await expect(page.locator('text=Flexible hiring models')).toBeVisible()
    await expect(page.locator('text=Generate perfect job posts')).toBeVisible()
    
    // Verify worker opportunities section is NOT present
    await expect(page.locator('text=Work that fits your life')).not.toBeVisible()
  })

  test('role persists after page reload', async ({ page }) => {
    // Navigate to /work
    await page.goto('/work')
    
    // Verify worker content is shown
    await expect(page.locator('text=Earn from Anywhere')).toBeVisible()
    
    // Reload page
    await page.reload()
    
    // Verify role persisted - still on /work with worker content
    await expect(page.url()).toContain('/work')
    await expect(page.locator('text=Earn from Anywhere')).toBeVisible()
    await expect(page.locator('text=Hire Talent Fast')).not.toBeVisible()
    
    // Verify bottom sections remain role-specific
    await expect(page.locator('[data-role="worker"]').last()).toBeVisible()
  })

  test('/work route shows only worker content', async ({ page }) => {
    // Navigate directly to /work
    await page.goto('/work')
    
    // Verify worker content is shown
    await expect(page.locator('text=Earn from Anywhere')).toBeVisible()
    
    // Verify NO client sections are present
    const clientSections = page.locator('[data-role="client"]')
    await expect(clientSections).toHaveCount(0)
    
    // Verify worker-specific bottom CTA
    await expect(page.locator('text=Ready to get started?')).toBeVisible()
    await expect(page.locator('a:has-text("Get Started Free")')).toBeVisible()
  })

  test('/clients route shows only client content', async ({ page }) => {
    // Navigate directly to /clients
    await page.goto('/clients')
    
    // Verify client content is shown
    await expect(page.locator('text=Hire Talent Fast')).toBeVisible()
    
    // Verify NO worker sections are present
    const workerSections = page.locator('[data-role="worker"]')
    await expect(workerSections).toHaveCount(0)
    
    // Verify client-specific bottom CTA
    await expect(page.locator('text=Ready to hire talent?')).toBeVisible()
    await expect(page.locator('a:has-text("Get Started Free")')).toBeVisible()
  })

  test('header pill switches roles and navigates to correct route', async ({ page }) => {
    // Navigate to /work first
    await page.goto('/work')
    await expect(page.locator('text=Earn from Anywhere')).toBeVisible()
    
    // Find and click header toggle
    const headerToggle = page.locator('[aria-label="Switch role view"]')
    if (await headerToggle.isVisible()) {
      await headerToggle.locator('button:has-text("Client")').click()
      
      // Should navigate to /clients
      await page.waitForURL(/\/clients/)
      
      // Verify switched to client view
      await expect(page.locator('text=Hire Talent Fast')).toBeVisible()
      await expect(page.locator('text=Earn from Anywhere')).not.toBeVisible()
    }
  })

  test('links preserve role context on role-specific pages', async ({ page }) => {
    // Navigate to /work (worker page)
    await page.goto('/work')
    await expect(page.locator('text=Earn from Anywhere')).toBeVisible()
    
    // Check that links on worker page are role-aware
    // Links should either have role=worker param or link to worker-specific routes
    const browseJobsLink = page.locator('a:has-text("Browse Jobs")')
    if (await browseJobsLink.isVisible()) {
      const href = await browseJobsLink.getAttribute('href')
      // Link should either contain role=worker or be a worker-specific route
      expect(href).toMatch(/role=worker|\/worker/)
    }
    
    // Navigate to /clients (client page)
    await page.goto('/clients')
    await expect(page.locator('text=Hire Talent Fast')).toBeVisible()
    
    // Check that links on client page are role-aware
    const browseTalentLink = page.locator('a:has-text("Browse Talent")')
    if (await browseTalentLink.isVisible()) {
      const href = await browseTalentLink.getAttribute('href')
      // Link should either contain role=client or be a client-specific route
      expect(href).toMatch(/role=client|\/workers/)
    }
  })

  test('shared sections are visible for both roles', async ({ page }) => {
    // Navigate to /work
    await page.goto('/work')
    
    // Verify shared sections are visible
    await expect(page.locator('text=Why choose 2ndShift?')).toBeVisible()
    await expect(page.locator('text=Simple process')).toBeVisible()
    
    // Navigate to /clients
    await page.goto('/clients')
    
    // Verify shared sections are still visible
    await expect(page.locator('text=Why choose 2ndShift?')).toBeVisible()
    await expect(page.locator('text=Simple process')).toBeVisible()
  })

  test('bottom CTA is role-specific on dedicated pages', async ({ page }) => {
    // Test worker page CTA
    await page.goto('/work')
    const workerCTA = page.locator('section[data-role="worker"]').last()
    await expect(workerCTA.locator('text=Ready to get started?')).toBeVisible()
    await expect(workerCTA.locator('a:has-text("Get Started Free")')).toBeVisible()
    
    // Test client page CTA
    await page.goto('/clients')
    const clientCTA = page.locator('section[data-role="client"]').last()
    await expect(clientCTA.locator('text=Ready to hire talent?')).toBeVisible()
    await expect(clientCTA.locator('a:has-text("Get Started Free")')).toBeVisible()
  })

  test('smooth scroll to top on role change', async ({ page }) => {
    // Scroll down first
    await page.evaluate(() => window.scrollTo(0, 1000))
    
    // Select a role
    await page.click('button:has-text("I Want to Work")')
    
    // Wait a bit for scroll animation
    await page.waitForTimeout(500)
    
    // Verify we're at the top (or close to it)
    const scrollY = await page.evaluate(() => window.scrollY)
    expect(scrollY).toBeLessThan(100)
  })
})
