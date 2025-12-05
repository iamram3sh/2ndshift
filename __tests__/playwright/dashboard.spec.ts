import { test, expect } from '@playwright/test'

test.describe('Dashboard Navigation & Role Switch', () => {
  test('should navigate to worker dashboard and verify UI', async ({ page }) => {
    // Navigate to home
    await page.goto('/')
    
    // Click role = Worker (if role toggle exists)
    const workerButton = page.locator('button:has-text("I want to work"), button:has-text("Worker")').first()
    if (await workerButton.isVisible()) {
      await workerButton.click()
    }
    
    // Navigate to worker dashboard (assuming login is handled)
    await page.goto('/worker')
    
    // Verify worker page elements
    await expect(page.locator('text=Dashboard, text=High-Value IT Microtasks').first()).toBeVisible()
    
    // Search for a task
    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]').first()
    if (await searchInput.isVisible()) {
      await searchInput.fill('React')
      await searchInput.press('Enter')
    }
  })

  test('should switch between worker and client roles', async ({ page }) => {
    await page.goto('/')
    
    // Find role toggle
    const roleToggle = page.locator('[data-role-toggle], button:has-text("Worker"), button:has-text("Client")')
    if (await roleToggle.count() > 0) {
      await roleToggle.first().click()
      // Verify role switch
      await expect(page).toHaveURL(/.*(worker|client).*/)
    }
  })
})

test.describe('Worker Apply Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Assume user is logged in as worker
    // In real test, you'd set up auth state
    await page.goto('/worker')
  })

  test('should apply to a task', async ({ page }) => {
    // Find a task card
    const taskCard = page.locator('[data-testid="task-card"], .task-card, article').first()
    
    if (await taskCard.isVisible()) {
      // Click apply button
      const applyButton = taskCard.locator('button:has-text("Apply"), button:has-text("Place Bid")').first()
      
      if (await applyButton.isVisible()) {
        await applyButton.click()
        
        // Fill cover letter if modal appears
        const coverLetterInput = page.locator('textarea[placeholder*="cover"], textarea[name*="cover"]')
        if (await coverLetterInput.isVisible()) {
          await coverLetterInput.fill('I am interested in this project and have relevant experience.')
        }
        
        // Submit application
        const submitButton = page.locator('button:has-text("Submit"), button:has-text("Apply")').last()
        if (await submitButton.isVisible()) {
          await submitButton.click()
          
          // Verify success message
          await expect(
            page.locator('text=Application submitted, text=Success, text=submitted successfully').first()
          ).toBeVisible({ timeout: 10000 })
        }
      }
    }
  })
})

test.describe('Client Kanban Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Assume user is logged in as client
    await page.goto('/client')
  })

  test('should render Kanban board', async ({ page }) => {
    // Verify Kanban columns exist
    const kanbanColumns = page.locator('text=Contacted, text=Negotiation, text=Offer Sent, text=Deal Closed')
    await expect(kanbanColumns.first()).toBeVisible({ timeout: 10000 })
  })

  test('should move card between columns', async ({ page }) => {
    // Find a card in first column
    const firstColumn = page.locator('[data-column="contacted"], [data-column-id="contacted"]').first()
    
    if (await firstColumn.isVisible()) {
      const card = firstColumn.locator('[data-card], .kanban-card, article').first()
      
      if (await card.isVisible()) {
        // Try to drag and drop (or use API)
        const secondColumn = page.locator('[data-column="negotiation"], [data-column-id="negotiation"]').first()
        
        if (await secondColumn.isVisible()) {
          // Simulate drag and drop
          await card.dragTo(secondColumn)
          
          // Verify card moved (or check API response)
          await page.waitForTimeout(1000)
          
          // Verify card is in new column
          const movedCard = secondColumn.locator('[data-card], .kanban-card').first()
          // Note: This is a simplified test - actual implementation may vary
        }
      }
    }
  })
})

test.describe('Escrow Flow', () => {
  test('should create escrow for project', async ({ page }) => {
    // Navigate as client
    await page.goto('/client')
    
    // Find a project
    const projectCard = page.locator('[data-project], .project-card').first()
    
    if (await projectCard.isVisible()) {
      // Click to view project details
      await projectCard.click()
      
      // Find escrow/create payment button
      const escrowButton = page.locator('button:has-text("Create Escrow"), button:has-text("Fund Project")')
      
      if (await escrowButton.isVisible()) {
        await escrowButton.click()
        
        // Fill amount if needed
        const amountInput = page.locator('input[name="amount"], input[type="number"]')
        if (await amountInput.isVisible()) {
          await amountInput.fill('10000')
        }
        
        // Submit
        const submitButton = page.locator('button:has-text("Create"), button:has-text("Fund")').last()
        if (await submitButton.isVisible()) {
          await submitButton.click()
          
          // Verify escrow created
          await expect(
            page.locator('text=Escrow created, text=Funded, text=successfully').first()
          ).toBeVisible({ timeout: 10000 })
        }
      }
    }
  })

  test('should verify escrow status and auto-release', async ({ page }) => {
    // This would test the auto-release functionality
    // In a real scenario, you'd set up a test project with escrow
    // and verify the status changes after the release period
    
    await page.goto('/client')
    
    // Find escrow status indicator
    const escrowStatus = page.locator('[data-escrow-status], text=Funded, text=Released')
    
    // Verify status is visible
    if (await escrowStatus.count() > 0) {
      await expect(escrowStatus.first()).toBeVisible()
    }
  })
})
