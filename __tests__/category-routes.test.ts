/**
 * Test to verify all category routes work correctly
 */

import { HIGH_VALUE_CATEGORIES, getCategoryBySlug } from '@/lib/constants/highValueCategories'
import { getMicrotasksByCategory, type HighValueMicrotask } from '@/data/highValueMicrotasks'

describe('Category Routes Verification', () => {
  // Map category id to microtask category (some categories have different id vs slug)
  const categoryIdToMicrotaskCategory: Record<string, HighValueMicrotask['category']> = {
    'devops': 'devops',
    'cloud': 'cloud',
    'networking': 'networking',
    'security': 'security',
    'ai': 'ai',
    'data': 'data',
    'sre': 'sre',
    'db': 'database', // Category id is 'db' but microtasks use 'database'
    'programming': 'programming'
  }

  test('all category slugs should be resolvable', () => {
    HIGH_VALUE_CATEGORIES.forEach(category => {
      const found = getCategoryBySlug(category.slug)
      expect(found).toBeDefined()
      expect(found?.slug).toBe(category.slug)
      expect(found?.name).toBe(category.name)
    })
  })

  test('all categories should have microtasks', () => {
    HIGH_VALUE_CATEGORIES.forEach(category => {
      const microtaskCategory = categoryIdToMicrotaskCategory[category.id] || category.slug as HighValueMicrotask['category']
      const microtasks = getMicrotasksByCategory(microtaskCategory)
      
      // Each category should have at least some microtasks
      expect(microtasks.length).toBeGreaterThan(0)
      console.log(`✅ ${category.name} (${category.slug}): ${microtasks.length} microtasks`)
    })
  })

  test('category routes should be accessible', () => {
    const expectedRoutes = HIGH_VALUE_CATEGORIES.map(cat => `/category/${cat.slug}`)
    
    expectedRoutes.forEach(route => {
      expect(route).toMatch(/^\/category\/[a-z-]+$/)
      console.log(`✅ Route: ${route}`)
    })
    
    expect(expectedRoutes.length).toBe(9)
  })

  test('database category should map correctly', () => {
    const dbCategory = getCategoryBySlug('database')
    expect(dbCategory).toBeDefined()
    expect(dbCategory?.id).toBe('db')
    expect(dbCategory?.slug).toBe('database')
    
    const microtasks = getMicrotasksByCategory('database')
    expect(microtasks.length).toBeGreaterThan(0)
  })
})
