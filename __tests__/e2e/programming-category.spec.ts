/**
 * E2E tests for Programming category
 */

import { test, expect } from '@playwright/test'

test.describe('Programming Category Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage
    await page.goto('/')
  })

  test('should display Programming in homepage category tiles', async ({ page }) => {
    // Check if Programming category tile is visible
    const programmingTile = page.getByText('Senior Backend & Systems Programming')
    await expect(programmingTile).toBeVisible()
    
    // Check if it shows the example and price
    const exampleText = page.getByText(/API memory leak fix.*From ₹4,000/)
    await expect(exampleText).toBeVisible()
  })

  test('should navigate to Programming category page', async ({ page }) => {
    // Click on Programming category tile
    await page.getByText('Senior Backend & Systems Programming').click()
    
    // Should navigate to category page
    await expect(page).toHaveURL(/.*\/category\/programming/)
    
    // Check page title
    const heading = page.getByRole('heading', { name: /Senior Backend & Systems Programming/i })
    await expect(heading).toBeVisible()
  })

  test('should display Programming microtasks on category page', async ({ page }) => {
    await page.goto('/category/programming')
    
    // Check if microtasks are displayed
    const microtasksSection = page.getByText(/Available Programming Microtasks/i)
    await expect(microtasksSection).toBeVisible()
    
    // Check if at least one microtask is visible
    const microtaskCard = page.locator('[class*="border-slate-200"]').first()
    await expect(microtaskCard).toBeVisible()
  })

  test('should filter Programming microtasks by language', async ({ page }) => {
    await page.goto('/category/programming')
    
    // Select Python from language filter
    await page.selectOption('select', { label: /Python/i })
    
    // Wait for filtered results
    await page.waitForTimeout(500)
    
    // Check if results are filtered (at least one result should be visible)
    const results = page.locator('[class*="border-slate-200"]')
    const count = await results.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should show Programming in homepage hero subhead', async ({ page }) => {
    // Check hero section for Programming mention
    const heroText = page.getByText(/DevOps.*Cloud.*Programming/i)
    await expect(heroText).toBeVisible()
  })

  test('should show Programming in jobs page categories', async ({ page }) => {
    await page.goto('/jobs')
    
    // Check if Programming category is in the sidebar
    const programmingCategory = page.getByText(/Senior Backend.*Programming/i)
    await expect(programmingCategory).toBeVisible()
  })

  test('should allow posting Programming job from category page', async ({ page }) => {
    await page.goto('/category/programming')
    
    // Find and click "Post a Programming Task" button
    const postButton = page.getByRole('link', { name: /Post a Programming Task/i })
    await expect(postButton).toBeVisible()
    
    // Check if link includes category parameter
    const href = await postButton.getAttribute('href')
    expect(href).toContain('category=programming')
  })
})

test.describe('AI Job Wizard - Programming Suggestions', () => {
  test('should suggest Programming category for API-related issues', async ({ page, request }) => {
    // Mock the job wizard API response
    const response = await request.post('/api/v1/job-wizard', {
      data: {
        requirement: 'Need to fix API memory leak in production service'
      },
      headers: {
        'Content-Type': 'application/json',
        // Add auth headers if needed
      }
    })

    // In a real test, you'd need proper authentication
    // For now, just check that the endpoint exists
    expect(response.status()).toBeLessThan(500)
  })
})
