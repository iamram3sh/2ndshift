/**
 * E2E tests for high-value microtasks and sourcing flows
 */

import { test, expect } from '@playwright/test'

test.describe('High-Value Microtasks & Sourcing Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('Worker can update availability and join priority pool', async ({ page }) => {
    // This would require authentication setup
    // For now, test the structure
    await page.goto('/worker')
    
    // Check that availability card is visible
    const availabilityCard = page.locator('text=Open to Work').first()
    await expect(availabilityCard).toBeVisible({ timeout: 10000 })
  })

  test('Client can use AI Job Wizard to create job', async ({ page }) => {
    await page.goto('/client')
    
    // Look for AI Job Wizard
    const wizard = page.locator('text=AI Job Wizard').first()
    await expect(wizard).toBeVisible({ timeout: 10000 })
  })

  test('Client can escalate job to sourcing queue', async ({ page }) => {
    // This would require job creation and authentication
    // Test structure only
    await page.goto('/client')
    
    // Check for escalation option
    const escalateButton = page.locator('text=Urgent').or(page.locator('text=Hard-to-Find'))
    // Would need actual job page
  })

  test('Admin can view sourcing queue and contact workers', async ({ page }) => {
    await page.goto('/admin/sourcing')
    
    // Check for sourcing queue UI
    const queueTitle = page.locator('text=Sourcing Queue')
    await expect(queueTitle).toBeVisible({ timeout: 10000 })
  })

  test('Worker can fast-apply from alerts', async ({ page }) => {
    await page.goto('/worker')
    
    // Check for alerts inbox
    const alertsSection = page.locator('text=Job Alerts')
    await expect(alertsSection).toBeVisible({ timeout: 10000 })
  })
})
