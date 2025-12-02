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

  test('clicking "I want to work" shows worker content', async ({ page }) => {
    // Click the worker button
    await page.click('button:has-text("I Want to Work")')
    
    // Wait for role to be set
    await page.waitForURL(/\?role=worker/)
    
    // Verify worker hero content is visible
    await expect(page.locator('text=Earn from Anywhere')).toBeVisible()
    
    // Verify client hero content is hidden
    await expect(page.locator('text=Hire Talent Fast')).not.toBeVisible()
    
    // Verify worker opportunities section is visible
    await expect(page.locator('text=Work that fits your life')).toBeVisible()
    
    // Verify client opportunities section is hidden
    await expect(page.locator('text=Ready to hire talent?')).not.toBeVisible()
  })

  test('clicking "I want to hire" shows client content', async ({ page }) => {
    // Click the client button
    await page.click('button:has-text("I Want to Hire")')
    
    // Wait for role to be set
    await page.waitForURL(/\?role=client/)
    
    // Verify client hero content is visible
    await expect(page.locator('text=Hire Talent Fast')).toBeVisible()
    
    // Verify worker hero content is hidden
    await expect(page.locator('text=Earn from Anywhere')).not.toBeVisible()
    
    // Verify client opportunities section is visible
    await expect(page.locator('text=Ready to hire talent?')).toBeVisible()
    
    // Verify worker opportunities section is hidden
    await expect(page.locator('text=Work that fits your life')).not.toBeVisible()
  })

  test('role persists after page reload', async ({ page }) => {
    // Select worker role
    await page.click('button:has-text("I Want to Work")')
    await page.waitForURL(/\?role=worker/)
    
    // Reload page
    await page.reload()
    
    // Verify role persisted
    await expect(page.locator('text=Earn from Anywhere')).toBeVisible()
    await expect(page.locator('text=Hire Talent Fast')).not.toBeVisible()
  })

  test('query param ?role=worker loads worker view', async ({ page }) => {
    // Navigate directly with query param
    await page.goto('/?role=worker')
    
    // Verify worker content is shown
    await expect(page.locator('text=Earn from Anywhere')).toBeVisible()
    await expect(page.locator('text=Hire Talent Fast')).not.toBeVisible()
  })

  test('query param ?role=client loads client view', async ({ page }) => {
    // Navigate directly with query param
    await page.goto('/?role=client')
    
    // Verify client content is shown
    await expect(page.locator('text=Hire Talent Fast')).toBeVisible()
    await expect(page.locator('text=Earn from Anywhere')).not.toBeVisible()
  })

  test('header pill switches roles', async ({ page }) => {
    // First select worker role
    await page.click('button:has-text("I Want to Work")')
    await page.waitForURL(/\?role=worker/)
    
    // Find and click header toggle (if visible)
    const headerToggle = page.locator('[aria-label="Switch role view"]')
    if (await headerToggle.isVisible()) {
      await headerToggle.locator('button:has-text("Client")').click()
      
      // Verify switched to client view
      await expect(page.locator('text=Hire Talent Fast')).toBeVisible()
      await expect(page.locator('text=Earn from Anywhere')).not.toBeVisible()
    }
  })

  test('links preserve role param', async ({ page }) => {
    // Select worker role
    await page.click('button:has-text("I Want to Work")')
    await page.waitForURL(/\?role=worker/)
    
    // Click a link (e.g., "Browse Jobs")
    const browseJobsLink = page.locator('a:has-text("Browse Jobs")')
    if (await browseJobsLink.isVisible()) {
      const href = await browseJobsLink.getAttribute('href')
      expect(href).toContain('role=worker')
    }
  })

  test('shared sections are visible for both roles', async ({ page }) => {
    // Select worker role
    await page.click('button:has-text("I Want to Work")')
    await page.waitForURL(/\?role=worker/)
    
    // Verify shared sections are visible
    await expect(page.locator('text=Why choose 2ndShift?')).toBeVisible()
    await expect(page.locator('text=Simple process')).toBeVisible()
    
    // Switch to client role
    await page.click('button:has-text("I Want to Hire")')
    await page.waitForURL(/\?role=client/)
    
    // Verify shared sections are still visible
    await expect(page.locator('text=Why choose 2ndShift?')).toBeVisible()
    await expect(page.locator('text=Simple process')).toBeVisible()
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
