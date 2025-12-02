/**
 * Verification script to test all category routes
 * Run with: npx tsx scripts/verify-category-routes.ts
 */

import { HIGH_VALUE_CATEGORIES, getCategoryBySlug } from '../lib/constants/highValueCategories'
import { getMicrotasksByCategory } from '../data/highValueMicrotasks'

console.log('🔍 Verifying Category Routes\n')

// Test all category slugs
const categorySlugs = HIGH_VALUE_CATEGORIES.map(cat => cat.slug)

console.log('📋 Testing Category Slugs:')
categorySlugs.forEach(slug => {
  const category = getCategoryBySlug(slug)
  if (category) {
    console.log(`  ✅ ${slug} → ${category.name}`)
    
    // Map category id to microtask category
    const categoryIdToMicrotaskCategory: Record<string, any> = {
      'devops': 'devops',
      'cloud': 'cloud',
      'networking': 'networking',
      'security': 'security',
      'ai': 'ai',
      'data': 'data',
      'sre': 'sre',
      'db': 'database',
      'programming': 'programming'
    }
    
    const microtaskCategory = categoryIdToMicrotaskCategory[category.id] || category.slug
    const microtasks = getMicrotasksByCategory(microtaskCategory)
    console.log(`     Microtasks: ${microtasks.length} found`)
  } else {
    console.log(`  ❌ ${slug} → NOT FOUND`)
  }
})

console.log('\n📊 Summary:')
console.log(`  Total Categories: ${HIGH_VALUE_CATEGORIES.length}`)
console.log(`  Expected Routes:`)
categorySlugs.forEach(slug => {
  console.log(`    /category/${slug}`)
})

console.log('\n✅ All category routes should be accessible via /category/[slug]')
