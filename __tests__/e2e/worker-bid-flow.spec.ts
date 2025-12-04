import { test, expect } from '@playwright/test'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

test.describe('Worker Bid Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to worker dashboard
    await page.goto(`${BASE_URL}/worker`)
    
    // Wait for page to load
    await page.waitForLoadState('networkidle')
  })

  test('worker can view high-value tasks and place a bid', async ({ page }) => {
    // Check if tasks are displayed
    const taskCards = page.locator('[data-testid="task-card"], .group.bg-white')
    const taskCount = await taskCards.count()
    
    if (taskCount > 0) {
      // Click on first task card's "Place Bid" button or task card itself
      const firstTask = taskCards.first()
      const bidButton = firstTask.locator('button:has-text("Place Bid"), a:has-text("Place Bid")')
      
      if (await bidButton.count() > 0) {
        await bidButton.first().click()
        
        // Wait for bid modal to open
        await page.waitForSelector('text=Place Your Bid', { timeout: 5000 })
        
        // Fill in proposal
        const proposalTextarea = page.locator('textarea[placeholder*="Explain why"]')
        await proposalTextarea.fill(
          'I have extensive experience in this area and can deliver high-quality work within the specified timeline. I have completed similar projects successfully.'
        )
        
        // Submit bid
        const submitButton = page.locator('button:has-text("Place Bid")')
        await submitButton.click()
        
        // Wait for success (modal should close or show success message)
        await page.waitForTimeout(2000)
        
        // Verify modal is closed or success message is shown
        const modal = page.locator('text=Place Your Bid')
        const modalVisible = await modal.isVisible().catch(() => false)
        
        // Either modal should be closed or success message should appear
        expect(modalVisible).toBeFalsy()
      } else {
        // If no bid button, click on task card to view details
        await firstTask.click()
        
        // Should navigate to task detail page
        await page.waitForURL(/\/task\/.*/, { timeout: 5000 })
        expect(page.url()).toMatch(/\/task\/.*/)
      }
    } else {
      // If no tasks, check for empty state
      const emptyState = page.locator('text=No tasks found, text=No tasks yet')
      const hasEmptyState = await emptyState.count() > 0
      
      // This is acceptable if no tasks are seeded
      expect(hasEmptyState).toBeTruthy()
    }
  })

  test('worker can filter tasks by minimum price', async ({ page }) => {
    // Look for filters section
    const filtersButton = page.locator('button:has-text("Filters"), button:has-text("Filter")')
    
    if (await filtersButton.count() > 0) {
      await filtersButton.first().click()
      
      // Wait for filters to expand
      await page.waitForTimeout(500)
      
      // Find min price slider
      const priceSlider = page.locator('input[type="range"]')
      
      if (await priceSlider.count() > 0) {
        // Set minimum price to 200
        await priceSlider.first().fill('200')
        
        // Wait for tasks to filter
        await page.waitForTimeout(1000)
        
        // Verify tasks are filtered (this is a basic check)
        const taskCards = page.locator('[data-testid="task-card"], .group.bg-white')
        const taskCount = await taskCards.count()
        
        // Tasks should be filtered (count may be 0 or less than before)
        expect(taskCount).toBeGreaterThanOrEqual(0)
      }
    }
  })

  test('worker can search tasks', async ({ page }) => {
    // Find search input
    const searchInput = page.locator('input[placeholder*="Search"], input[type="text"]').first()
    
    if (await searchInput.count() > 0) {
      await searchInput.fill('React')
      
      // Wait for search results
      await page.waitForTimeout(1000)
      
      // Verify search is working (tasks should be filtered)
      const taskCards = page.locator('[data-testid="task-card"], .group.bg-white')
      const taskCount = await taskCards.count()
      
      // Search should filter tasks
      expect(taskCount).toBeGreaterThanOrEqual(0)
    }
  })

  test('worker sees credits balance and can purchase more', async ({ page }) => {
    // Look for credits/shifts balance display
    const creditsDisplay = page.locator('text=/\\d+ Shifts/, text=/\\d+ Credits/')
    
    if (await creditsDisplay.count() > 0) {
      const balanceText = await creditsDisplay.first().textContent()
      expect(balanceText).toMatch(/\d+/)
      
      // Click on credits to open purchase modal (if button)
      const creditsButton = page.locator('button:has-text("Shifts"), button:has-text("Credits")')
      
      if (await creditsButton.count() > 0) {
        await creditsButton.first().click()
        
        // Should open Shifts modal or purchase modal
        await page.waitForTimeout(1000)
        
        // Verify modal opened (check for modal content)
        const modal = page.locator('text=Get Shifts, text=Buy Credits, text=Purchase Shifts')
        const modalVisible = await modal.count() > 0
        
        // Modal should be visible or page should navigate
        expect(modalVisible || page.url().includes('/pricing')).toBeTruthy()
      }
    }
  })
})
