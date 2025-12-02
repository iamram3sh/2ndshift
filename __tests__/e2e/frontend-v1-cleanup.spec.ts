/**
 * E2E tests for frontend v1 cleanup
 * Tests high-value marketplace model, role separation, and category enforcement
 */

import { test, expect } from '@playwright/test'

test.describe('Frontend V1 Cleanup - High-Value Marketplace', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('homepage shows only 9 high-value category tiles', async ({ page }) => {
    const categoryTiles = page.locator('[href^="/category/"]')
    const count = await categoryTiles.count()
    expect(count).toBe(9)

    // Verify all 9 categories are present
    const categories = [
      'DevOps',
      'Cloud',
      'Networking',
      'Cybersecurity',
      'AI',
      'Data',
      'SRE',
      'Database',
      'Programming'
    ]

    for (const category of categories) {
      await expect(page.locator(`text=${category}`).first()).toBeVisible()
    }
  })

  test('homepage has no low-value categories', async ({ page }) => {
    const lowValueTerms = ['Logo Design', 'Content Writing', 'UI/UX Design', 'Mobile App']
    
    for (const term of lowValueTerms) {
      const content = await page.textContent('body')
      expect(content).not.toContain(term)
    }
  })

  test('homepage hero has correct headline and CTAs', async ({ page }) => {
    await expect(page.locator('h1:has-text("Hire verified, senior IT pros")')).toBeVisible()
    await expect(page.locator('text=I want to work')).toBeVisible()
    await expect(page.locator('text=I want to hire')).toBeVisible()
    
    // Verify CTA spacing (desktop: 48px gap)
    const ctas = page.locator('a:has-text("I want to work"), a:has-text("I want to hire")')
    const firstCta = ctas.first()
    const secondCta = ctas.nth(1)
    
    if (await firstCta.isVisible() && await secondCta.isVisible()) {
      const firstBox = await firstCta.boundingBox()
      const secondBox = await secondCta.boundingBox()
      if (firstBox && secondBox) {
        const gap = secondBox.x - (firstBox.x + firstBox.width)
        // Should be approximately 48px on desktop (allowing for flex gap)
        expect(gap).toBeGreaterThan(30)
      }
    }
  })

  test('homepage has trust strip section', async ({ page }) => {
    await expect(page.locator('text=Verified Professionals')).toBeVisible()
    await expect(page.locator('text=Certifications Validated')).toBeVisible()
    await expect(page.locator('text=Secure Escrow Protection')).toBeVisible()
  })

  test('homepage has featured experts section', async ({ page }) => {
    await expect(page.locator('h2:has-text("Featured Experts")')).toBeVisible()
    const expertCards = page.locator('[class*="border-slate-200"]').filter({ hasText: /₹\d+\/hr/ })
    const count = await expertCards.count()
    expect(count).toBeGreaterThan(0)
  })

  test('homepage has high-value microtasks grid', async ({ page }) => {
    await expect(page.locator('h2:has-text("High-Value Microtasks")')).toBeVisible()
    const microtaskCards = page.locator('text=/₹\\d+,?\\d* - ₹\\d+,?\\d*/')
    const count = await microtaskCards.count()
    expect(count).toBeGreaterThan(0)
  })

  test('clicking "I want to work" lands on /work with only worker content', async ({ page }) => {
    await page.click('text=I want to work')
    await page.waitForURL('**/work**')
    
    // Verify worker-specific content
    await expect(page.locator('text=Take high-value technical microtasks')).toBeVisible()
    await expect(page.locator('text=Create your profile')).toBeVisible()
    
    // Verify no client content
    await expect(page.locator('text=Post a Job')).not.toBeVisible()
    await expect(page.locator('text=Hire Talent Fast')).not.toBeVisible()
  })

  test('clicking "I want to hire" lands on /clients with only client content', async ({ page }) => {
    await page.click('text=I want to hire')
    await page.waitForURL('**/clients**')
    
    // Verify client-specific content
    await expect(page.locator('text=Hire Talent Fast')).toBeVisible()
    await expect(page.locator('text=High-Value Expert Categories')).toBeVisible()
    
    // Verify no worker content
    await expect(page.locator('text=Take high-value technical microtasks')).not.toBeVisible()
    await expect(page.locator('text=Create your profile')).not.toBeVisible()
  })

  test('worker page shows only high-value microtasks', async ({ page }) => {
    await page.goto('/work?role=worker')
    
    // Verify high-value tasks
    const highValueTasks = ['CI/CD', 'API', 'AWS', 'Database', 'RAG', 'Security']
    const pageContent = await page.textContent('body')
    
    for (const task of highValueTasks) {
      expect(pageContent).toContain(task)
    }
    
    // Verify no low-value tasks
    const lowValueTasks = ['Logo Design', 'Content Writing', 'UI/UX Design']
    for (const task of lowValueTasks) {
      expect(pageContent).not.toContain(task)
    }
  })

  test('client page shows high-value categories grid', async ({ page }) => {
    await page.goto('/clients?role=client')
    
    await expect(page.locator('h2:has-text("High-Value Expert Categories")')).toBeVisible()
    const categoryLinks = page.locator('a[href^="/category/"]')
    const count = await categoryLinks.count()
    expect(count).toBe(9)
  })

  test('login page shows role picker when no role selected', async ({ page }) => {
    await page.goto('/login')
    
    await expect(page.locator('text=Choose your role')).toBeVisible()
    await expect(page.locator('text=I want to work')).toBeVisible()
    await expect(page.locator('text=I want to hire')).toBeVisible()
  })

  test('login page shows role-specific form when role is selected', async ({ page }) => {
    await page.goto('/login?role=worker')
    
    await expect(page.locator('text=Welcome back, Professional')).toBeVisible()
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    
    // Verify no role picker is shown
    await expect(page.locator('text=Choose your role')).not.toBeVisible()
  })

  test('bottom CTA has readable text contrast', async ({ page }) => {
    await page.goto('/')
    
    const bottomCTA = page.locator('section:has-text("Ready to get started")').last()
    if (await bottomCTA.isVisible()) {
      const textElement = bottomCTA.locator('h2, p').first()
      const color = await textElement.evaluate((el) => {
        const style = window.getComputedStyle(el)
        return style.color
      })
      
      // Should be white or very light color
      expect(color).toMatch(/rgb\(255|rgba\(255/)
    }
  })

  test('all category routes work without 404', async ({ page }) => {
    const categories = ['devops', 'cloud', 'networking', 'security', 'ai', 'data', 'sre', 'database', 'programming']
    
    for (const category of categories) {
      const response = await page.goto(`/category/${category}`)
      expect(response?.status()).toBe(200)
      await expect(page.locator('h1')).toBeVisible()
    }
  })
})
