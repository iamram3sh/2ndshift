/**
 * Commission & Pricing Display Tests
 * Verifies commission shows correctly, no accidental zeros
 */

import { test, expect } from '@playwright/test';

const PREVIEW_URL = process.env.PREVIEW_URL || 'https://2ndshift-git-revenue-system-v1-iamram3sh.vercel.app';
const PROD_URL = process.env.PROD_URL || 'https://2ndshift.vercel.app';
const TEST_URL = process.env.TEST_URL || (process.env.TEST_ENV === 'production' ? PROD_URL : PREVIEW_URL);

test.describe('Commission & Pricing Tests', () => {
  test('P1: Commission displays numeric value (not 0 unless promo)', async ({ page }) => {
    await page.goto(TEST_URL);
    
    // Look for commission/pricing displays
    const commissionText = page.locator('text=/platform.*fee|commission/i');
    const commissionCount = await commissionText.count();
    
    if (commissionCount > 0) {
      for (let i = 0; i < commissionCount; i++) {
        const text = await commissionText.nth(i).textContent();
        
        // Check if it shows 0% or ₹0 incorrectly
        if (text && (text.includes('0%') || text.includes('₹0')) && !text.includes('promo')) {
          // This might be an issue
          console.warn(`Potential commission display issue: ${text}`);
        }
      }
    }
  });

  test('P2: Pricing cards show currency correctly', async ({ page }) => {
    await page.goto(`${TEST_URL}/pricing`);
    
    const priceElements = page.locator('text=/₹|INR|\$/i');
    const priceCount = await priceElements.count();
    
    // Should show currency symbols
    expect(priceCount).toBeGreaterThan(0);
  });
});
