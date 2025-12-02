/**
 * Tests for Programming category integration
 */

import { describe, it, expect, beforeEach } from '@jest/globals'
import { PROGRAMMING_MICROTASKS } from '../data/highValueProgrammingTasks'
import { HIGH_VALUE_CATEGORIES } from '../lib/constants/highValueCategories'

describe('Programming Category Integration', () => {
  describe('High-Value Categories', () => {
    it('should include Programming as the 9th category', () => {
      const programmingCategory = HIGH_VALUE_CATEGORIES.find(cat => cat.slug === 'programming')
      expect(programmingCategory).toBeDefined()
      expect(programmingCategory?.name).toBe('Senior Backend & Systems Programming')
      expect(HIGH_VALUE_CATEGORIES.length).toBe(9)
    })

    it('should have correct Programming category properties', () => {
      const programmingCategory = HIGH_VALUE_CATEGORIES.find(cat => cat.slug === 'programming')
      expect(programmingCategory?.id).toBe('programming')
      expect(programmingCategory?.description).toContain('Complex backend')
      expect(programmingCategory?.example).toBe('API memory leak fix')
      expect(programmingCategory?.priceRange).toBe('From ₹4,000')
    })
  })

  describe('Programming Microtasks', () => {
    it('should have at least 20 programming microtasks', () => {
      expect(PROGRAMMING_MICROTASKS.length).toBeGreaterThanOrEqual(20)
    })

    it('should have all required fields for each microtask', () => {
      PROGRAMMING_MICROTASKS.forEach(task => {
        expect(task.title).toBeTruthy()
        expect(task.description).toBeTruthy()
        expect(task.category).toBe('programming')
        expect(['low', 'medium', 'high']).toContain(task.complexity)
        expect(task.price_min).toBeGreaterThanOrEqual(4000)
        expect(task.price_max).toBeLessThanOrEqual(60000)
        expect(task.default_commission_percent).toBeGreaterThanOrEqual(8)
        expect(task.default_commission_percent).toBeLessThanOrEqual(18)
        expect(['6-24h', '3-7d', '1-4w']).toContain(task.delivery_window)
      })
    })

    it('should include high-value programming tasks', () => {
      const taskTitles = PROGRAMMING_MICROTASKS.map(t => t.title.toLowerCase())
      expect(taskTitles.some(t => t.includes('memory leak'))).toBe(true)
      expect(taskTitles.some(t => t.includes('performance') || t.includes('tuning'))).toBe(true)
      expect(taskTitles.some(t => t.includes('concurrency') || t.includes('thread'))).toBe(true)
      expect(taskTitles.some(t => t.includes('microservices') || t.includes('monolith'))).toBe(true)
    })
  })

  describe('Category Ordering', () => {
    it('should have Programming as the last category (9th)', () => {
      const lastCategory = HIGH_VALUE_CATEGORIES[HIGH_VALUE_CATEGORIES.length - 1]
      expect(lastCategory.slug).toBe('programming')
      expect(lastCategory.displayOrder).toBe(9)
    })

    it('should have categories in correct display order', () => {
      const sortedCategories = [...HIGH_VALUE_CATEGORIES].sort((a, b) => a.displayOrder - b.displayOrder)
      expect(sortedCategories).toEqual(HIGH_VALUE_CATEGORIES)
    })
  })
})

describe('Programming Category Helpers', () => {
  it('should find category by slug', () => {
    const { getCategoryBySlug } = require('../lib/constants/highValueCategories')
    const category = getCategoryBySlug('programming')
    expect(category).toBeDefined()
    expect(category?.name).toBe('Senior Backend & Systems Programming')
  })

  it('should find category by id', () => {
    const { getCategoryById } = require('../lib/constants/highValueCategories')
    const category = getCategoryById('programming')
    expect(category).toBeDefined()
    expect(category?.slug).toBe('programming')
  })
})
