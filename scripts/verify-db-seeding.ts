/**
 * Verify database seeding status
 * Checks if categories and microtasks are properly seeded
 */

import { supabaseAdmin } from '../lib/supabase/admin'

async function verifySeeding() {
  console.log('🔍 Verifying database seeding status...\n')

  try {
    // Check categories
    console.log('📁 Checking categories...')
    const { data: categories, error: categoriesError } = await supabaseAdmin
      .from('categories')
      .select('id, name, slug, is_active')
      .eq('is_active', true)

    if (categoriesError) {
      console.error('❌ Error fetching categories:', categoriesError.message)
      return
    }

    console.log(`✅ Found ${categories?.length || 0} active categories`)
    if (categories && categories.length > 0) {
      console.log('   Sample categories:')
      categories.slice(0, 5).forEach((cat: any) => {
        console.log(`   - ${cat.name} (${cat.slug})`)
      })
    }

    // Check microtasks
    console.log('\n📋 Checking microtasks...')
    const { data: microtasks, error: microtasksError } = await supabaseAdmin
      .from('microtasks')
      .select('id, title, category_id, complexity, base_price_min, base_price_max')

    if (microtasksError) {
      console.error('❌ Error fetching microtasks:', microtasksError.message)
      return
    }

    console.log(`✅ Found ${microtasks?.length || 0} microtasks`)
    
    if (microtasks && microtasks.length > 0) {
      // Group by category
      const byCategory: Record<string, number> = {}
      microtasks.forEach((task: any) => {
        const catId = task.category_id || 'uncategorized'
        byCategory[catId] = (byCategory[catId] || 0) + 1
      })

      console.log('   Microtasks by category:')
      Object.entries(byCategory).forEach(([catId, count]) => {
        console.log(`   - Category ${catId}: ${count} microtasks`)
      })

      // Check pricing
      const withPricing = microtasks.filter((task: any) => 
        task.base_price_min && task.base_price_max
      )
      console.log(`\n💰 ${withPricing.length}/${microtasks.length} microtasks have pricing set`)

      // Check complexity
      const complexityCounts: Record<string, number> = {}
      microtasks.forEach((task: any) => {
        const complexity = task.complexity || 'unknown'
        complexityCounts[complexity] = (complexityCounts[complexity] || 0) + 1
      })
      console.log('   Complexity distribution:')
      Object.entries(complexityCounts).forEach(([complexity, count]) => {
        console.log(`   - ${complexity}: ${count}`)
      })
    } else {
      console.log('⚠️  No microtasks found in database!')
      console.log('   Run seed script: npm run seed:highvalue')
    }

    // Summary
    console.log('\n📊 Summary:')
    console.log(`   Categories: ${categories?.length || 0} (target: >= 9)`)
    console.log(`   Microtasks: ${microtasks?.length || 0} (target: >= 50)`)
    
    if ((categories?.length || 0) >= 9 && (microtasks?.length || 0) >= 50) {
      console.log('\n✅ Database seeding looks good!')
    } else {
      console.log('\n⚠️  Database seeding incomplete. Run seed scripts.')
    }

  } catch (error: any) {
    console.error('❌ Verification failed:', error.message)
    console.error('\n💡 Make sure:')
    console.error('   1. NEXT_PUBLIC_SUPABASE_URL is set')
    console.error('   2. SUPABASE_SERVICE_ROLE_KEY is set')
    console.error('   3. Database is accessible')
  }
}

// Run if called directly
if (require.main === module) {
  verifySeeding()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

export { verifySeeding }
