/**
 * Unit tests for currency formatting utility
 */

import { formatCurrency, formatINR, setDefaultCurrency, getDefaultCurrency } from '@/lib/utils/formatCurrency'

describe('formatCurrency', () => {
  beforeEach(() => {
    setDefaultCurrency('INR')
  })

  it('should format INR amounts correctly', () => {
    expect(formatCurrency(10000, 'INR')).toMatch(/₹|Rs/)
    expect(formatCurrency(10000, 'INR')).toContain('100')
  })

  it('should default to INR when no currency specified', () => {
    const result = formatCurrency(50000)
    expect(result).toMatch(/₹|Rs/)
  })

  it('should handle paise to rupees conversion', () => {
    const result = formatCurrency(19900, 'INR')
    expect(result).toContain('199')
  })

  it('should format without symbol when showSymbol is false', () => {
    const result = formatCurrency(10000, 'INR', false)
    expect(result).not.toMatch(/₹|Rs/)
    expect(result).toContain('100')
  })

  it('should use formatINR shorthand', () => {
    const result = formatINR(25000)
    expect(result).toMatch(/₹|Rs/)
    expect(result).toContain('250')
  })

  it('should set and get default currency', () => {
    setDefaultCurrency('USD')
    expect(getDefaultCurrency()).toBe('USD')
    
    setDefaultCurrency('INR')
    expect(getDefaultCurrency()).toBe('INR')
  })
})
