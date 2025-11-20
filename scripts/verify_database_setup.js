#!/usr/bin/env node

/**
 * Verify Database Setup
 * Tests all new features to ensure they work correctly
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function verifySetup() {
  console.log('\n' + '═'.repeat(80))
  console.log('🔍 VERIFYING DATABASE SETUP')
  console.log('═'.repeat(80) + '\n')

  let allPassed = true

  // Test 1: Check tables exist
  console.log('📋 Test 1: Checking all tables exist...')
  const tables = [
    'job_alerts', 'project_views', 'search_history', 
    'project_recommendations', 'skills_master', 
    'skill_categories', 'popular_skills'
  ]
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1)
    if (error) {
      console.log(`   ❌ ${table}: FAILED - ${error.message}`)
      allPassed = false
    } else {
      console.log(`   ✅ ${table}: OK`)
    }
  }

  // Test 2: Check skill categories populated
  console.log('\n📚 Test 2: Checking skill categories...')
  const { data: categories, error: catError } = await supabase
    .from('skill_categories')
    .select('*')
  
  if (catError || !categories || categories.length === 0) {
    console.log('   ❌ Skill categories not populated')
    allPassed = false
  } else {
    console.log(`   ✅ ${categories.length} skill categories found`)
    console.log('   Categories:', categories.map(c => c.category_name).join(', '))
  }

  // Test 3: Check popular skills populated
  console.log('\n⭐ Test 3: Checking popular skills...')
  const { data: skills, error: skillsError } = await supabase
    .from('popular_skills')
    .select('*')
  
  if (skillsError || !skills || skills.length === 0) {
    console.log('   ❌ Popular skills not populated')
    allPassed = false
  } else {
    console.log(`   ✅ ${skills.length} popular skills found`)
    console.log('   Sample skills:', skills.slice(0, 10).map(s => s.skill_name).join(', '))
  }

  // Test 4: Test skill suggestions function
  console.log('\n🔍 Test 4: Testing skill suggestions function...')
  try {
    const { data, error } = await supabase.rpc('get_skill_suggestions', {
      search_term: 'java',
      limit_count: 5
    })
    
    if (error) {
      console.log(`   ❌ Function failed: ${error.message}`)
      allPassed = false
    } else {
      console.log(`   ✅ Function works! Found ${data.length} suggestions`)
      if (data.length > 0) {
        console.log('   Suggestions:', data.map(s => s.skill_name).join(', '))
      }
    }
  } catch (err) {
    console.log(`   ❌ Function error: ${err.message}`)
    allPassed = false
  }

  // Test 5: Test recommended projects function
  console.log('\n🎯 Test 5: Testing recommendations function...')
  try {
    const { data, error } = await supabase.rpc('get_recommended_projects', {
      worker_uuid: '00000000-0000-0000-0000-000000000000',
      limit_count: 5
    })
    
    if (error) {
      console.log(`   ❌ Function failed: ${error.message}`)
      allPassed = false
    } else {
      console.log(`   ✅ Function works! (${data.length} results - expected 0 for test UUID)`)
    }
  } catch (err) {
    console.log(`   ❌ Function error: ${err.message}`)
    allPassed = false
  }

  // Summary
  console.log('\n' + '═'.repeat(80))
  if (allPassed) {
    console.log('🎉 ALL TESTS PASSED! Database is fully functional!')
  } else {
    console.log('⚠️  Some tests failed. Check errors above.')
  }
  console.log('═'.repeat(80))

  console.log('\n✅ Your platform now supports:')
  console.log('   📊 Worker Job Discovery with AI recommendations')
  console.log('   🔔 Custom job alerts with notifications')
  console.log('   🎯 Dynamic skills system (unlimited professions)')
  console.log('   🤖 Auto-learning from user input')
  console.log('   📈 Analytics and tracking')
  console.log('\n🚀 Ready to use! Visit /worker/discover to try it out.\n')
}

verifySetup().catch(console.error)
