/**
 * E2E tests for complete role separation
 */

import { test, expect } from '@playwright/test'

test.describe('Role Separation - Complete', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.removeItem('2ndshift.role')
    })
  })

  test('Homepage shows only two hero CTAs and no header role toggle', async ({ page }) => {
    await page.goto('/')
    
    // Check hero CTAs exist
    const workCTA = page.getByRole('link', { name: /I want to work/i })
    const hireCTA = page.getByRole('link', { name: /I want to hire/i })
    
    await expect(workCTA).toBeVisible()
    await expect(hireCTA).toBeVisible()
    
    // Check no role toggle in header
    const roleToggle = page.locator('[role="tablist"]')
    await expect(roleToggle).not.toBeVisible()
  })

  test('Clicking "I want to work" lands on /work showing only worker content', async ({ page }) => {
    await page.goto('/')
    
    // Click "I want to work" CTA
    await page.getByRole('link', { name: /I want to work/i }).click()
    
    // Should navigate to /work
    await expect(page).toHaveURL(/.*\/work/)
    
    // Check worker-specific content is visible
    const workerHero = page.getByText(/Earn from Anywhere/i)
    await expect(workerHero).toBeVisible()
    
    // Check no client CTAs are visible
    const clientCTA = page.getByRole('link', { name: /Post Your First Job/i })
    await expect(clientCTA).not.toBeVisible()
    
    // Verify role is set in localStorage
    const role = await page.evaluate(() => localStorage.getItem('2ndshift.role'))
    expect(role).toBe('worker')
  })

  test('Clicking "I want to hire" lands on /clients showing only client content', async ({ page }) => {
    await page.goto('/')
    
    // Click "I want to hire" CTA
    await page.getByRole('link', { name: /I want to hire/i }).click()
    
    // Should navigate to /clients
    await expect(page).toHaveURL(/.*\/clients/)
    
    // Check client-specific content is visible
    const clientHero = page.getByText(/Hire Talent Fast/i)
    await expect(clientHero).toBeVisible()
    
    // Check no worker CTAs are visible
    const workerCTA = page.getByRole('link', { name: /Get Remote Work/i })
    await expect(workerCTA).not.toBeVisible()
    
    // Verify role is set in localStorage
    const role = await page.evaluate(() => localStorage.getItem('2ndshift.role'))
    expect(role).toBe('client')
  })

  test('Header Sign-in with no role opens role picker modal', async ({ page }) => {
    await page.goto('/')
    
    // Clear role
    await page.evaluate(() => {
      localStorage.removeItem('2ndshift.role')
    })
    
    // Click Sign in button
    await page.getByRole('button', { name: /Sign in/i }).first().click()
    
    // Check role picker modal is visible
    const rolePicker = page.getByText(/Choose your role/i)
    await expect(rolePicker).toBeVisible()
    
    // Check both role options are visible
    const workOption = page.getByRole('button', { name: /I want to work/i })
    const hireOption = page.getByRole('button', { name: /I want to hire/i })
    await expect(workOption).toBeVisible()
    await expect(hireOption).toBeVisible()
  })

  test('Header Sign-in with role selected navigates to role-specific login', async ({ page }) => {
    await page.goto('/')
    
    // Set role
    await page.evaluate(() => {
      localStorage.setItem('2ndshift.role', 'worker')
    })
    
    // Reload to apply role
    await page.reload()
    
    // Click Sign in link (should be a link, not button)
    const signInLink = page.getByRole('link', { name: /Sign in/i }).first()
    await expect(signInLink).toBeVisible()
    await signInLink.click()
    
    // Should navigate to login with role param
    await expect(page).toHaveURL(/.*\/login\?role=worker/)
  })

  test('Bookmark /work directly sets role and shows worker content', async ({ page }) => {
    // Navigate directly to /work
    await page.goto('/work')
    
    // Check worker content is visible
    const workerHero = page.getByText(/Earn from Anywhere/i)
    await expect(workerHero).toBeVisible()
    
    // Verify role is set
    const role = await page.evaluate(() => localStorage.getItem('2ndshift.role'))
    expect(role).toBe('worker')
  })

  test('Bookmark /clients directly sets role and shows client content', async ({ page }) => {
    // Navigate directly to /clients
    await page.goto('/clients')
    
    // Check client content is visible
    const clientHero = page.getByText(/Hire Talent Fast/i)
    await expect(clientHero).toBeVisible()
    
    // Verify role is set
    const role = await page.evaluate(() => localStorage.getItem('2ndshift.role'))
    expect(role).toBe('client')
  })

  test('Hero CTA spacing: desktop 48px gap, mobile stacked', async ({ page }) => {
    await page.goto('/')
    
    // Desktop view
    await page.setViewportSize({ width: 1280, height: 720 })
    const desktopCTAs = page.locator('a[href*="/work"], a[href*="/clients"]').filter({ hasText: /I want to/i })
    const count = await desktopCTAs.count()
    expect(count).toBeGreaterThanOrEqual(2)
    
    // Check gap on desktop (flex-row should have gap-12 which is 48px)
    const ctaContainer = desktopCTAs.first().locator('..')
    const containerClass = await ctaContainer.getAttribute('class')
    expect(containerClass).toContain('gap-12')
    
    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 })
    await page.reload()
    
    // Check mobile layout (flex-col should have gap-4 which is 18px)
    const mobileCTAs = page.locator('a[href*="/work"], a[href*="/clients"]').filter({ hasText: /I want to/i })
    const mobileContainer = mobileCTAs.first().locator('..')
    const mobileClass = await mobileContainer.getAttribute('class')
    expect(mobileClass).toContain('flex-col')
    expect(mobileClass).toContain('gap-4')
  })

  test('Role pages enforce role-only content - no cross-role content visible', async ({ page }) => {
    // Test worker page
    await page.goto('/work?role=worker')
    
    // Worker content should be visible
    await expect(page.getByText(/Earn from Anywhere/i)).toBeVisible()
    
    // Client content should NOT be visible
    await expect(page.getByText(/Post Your First Job/i)).not.toBeVisible()
    
    // Test client page
    await page.goto('/clients?role=client')
    
    // Client content should be visible
    await expect(page.getByText(/Hire Talent Fast/i)).toBeVisible()
    
    // Worker content should NOT be visible
    await expect(page.getByText(/Get Remote Work/i)).not.toBeVisible()
  })

  test('Role picker modal is keyboard accessible', async ({ page }) => {
    await page.goto('/')
    
    // Clear role
    await page.evaluate(() => {
      localStorage.removeItem('2ndshift.role')
    })
    
    // Tab to Sign in button
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    
    // Press Enter on Sign in
    await page.keyboard.press('Enter')
    
    // Modal should be visible
    const rolePicker = page.getByText(/Choose your role/i)
    await expect(rolePicker).toBeVisible()
    
    // Tab to first option and press Enter
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter')
    
    // Should navigate to login
    await expect(page).toHaveURL(/.*\/login\?role=/)
  })
})
