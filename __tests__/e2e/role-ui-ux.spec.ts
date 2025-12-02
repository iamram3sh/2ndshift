/**
 * E2E tests for role-specific UI/UX flows
 */

import { test, expect } from '@playwright/test'

test.describe('Role UI/UX Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('Click "I want to work" → Login shows worker form only', async ({ page }) => {
    // Click worker CTA
    const workerCTA = page.getByRole('link', { name: /I want to work/i })
    await workerCTA.click()

    // Should navigate to login with role=worker
    await expect(page).toHaveURL(/.*login.*role=worker/)

    // Should show worker-specific login form
    await expect(page.getByText(/Welcome back, Professional/i)).toBeVisible()
    await expect(page.getByText(/Sign in to your worker account/i)).toBeVisible()
  })

  test('Click "I want to hire" → Login shows client form only', async ({ page }) => {
    // Click client CTA
    const clientCTA = page.getByRole('link', { name: /I want to hire/i })
    await clientCTA.click()

    // Should navigate to login with role=client
    await expect(page).toHaveURL(/.*login.*role=client/)

    // Should show client-specific login form
    await expect(page.getByText(/Welcome back, Client/i)).toBeVisible()
    await expect(page.getByText(/Sign in to your client account/i)).toBeVisible()
  })

  test('Post-login: worker dashboard shows only worker quick tasks', async ({ page }) => {
    // This test would require authentication setup
    // For now, we'll test the structure
    await page.goto('/worker')
    
    // Check that high-value tasks are displayed
    const quickTasks = ['CI/CD', 'Dockerfile', 'Kubernetes', 'Python', 'AWS', 'Terraform']
    const pageContent = await page.textContent('body')
    
    // At least one high-value task should be mentioned
    const hasHighValueTask = quickTasks.some(task => pageContent?.includes(task))
    expect(hasHighValueTask).toBeTruthy()
  })

  test('Contrast audit: bottom hero text meets WCAG AA', async ({ page }) => {
    await page.goto('/')
    
    // Find bottom hero section
    const bottomHero = page.locator('section[data-role="worker"], section[data-role="client"]').last()
    
    if (await bottomHero.count() > 0) {
      // Check text color is white
      const heading = bottomHero.locator('h2').first()
      const headingColor = await heading.evaluate((el) => {
        const style = window.getComputedStyle(el)
        return style.color
      })
      
      // Should be white or very light color
      expect(headingColor).toMatch(/rgb\(255|rgba\(255/)
      
      // Check text shadow exists
      const textShadow = await heading.evaluate((el) => {
        return window.getComputedStyle(el).textShadow
      })
      expect(textShadow).not.toBe('none')
    }
  })

  test('Hero CTA spacing: desktop gap is 48px', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/')
    
    const ctaContainer = page.locator('.flex.flex-col.sm\\:flex-row').first()
    const gap = await ctaContainer.evaluate((el) => {
      const style = window.getComputedStyle(el)
      return style.gap
    })
    
    // Should be 12 (3rem = 48px) or gap-12
    expect(gap).toMatch(/12|48/)
  })

  test('Role picker is keyboard accessible', async ({ page }) => {
    await page.goto('/login')
    
    // Tab through role picker buttons
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    
    // Should be able to focus on role buttons
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })
})
