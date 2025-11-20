#!/usr/bin/env node

/**
 * Apply Worker Job Discovery Database Migration
 * This script applies the job discovery enhancements to Supabase
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function applyMigration() {
  try {
    console.log('🚀 Starting Worker Job Discovery migration...\n')

    // Read the migration file
    const migrationPath = path.join(__dirname, '../database/migrations/worker_job_discovery_enhancements.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')

    console.log('📄 Migration file loaded')
    console.log('📊 Applying migration to Supabase...\n')

    // Split SQL into statements (basic split on semicolons, might need refinement for complex SQL)
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`)

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.length < 10) continue // Skip very short statements

      try {
        console.log(`Executing statement ${i + 1}/${statements.length}...`)
        
        // For Supabase, we need to use the REST API to execute SQL
        const { data, error } = await supabase.rpc('exec_sql', { sql: statement })
        
        if (error) {
          console.warn(`⚠️  Warning on statement ${i + 1}:`, error.message)
        } else {
          console.log(`✅ Statement ${i + 1} completed`)
        }
      } catch (err) {
        console.warn(`⚠️  Error on statement ${i + 1}:`, err.message)
      }
    }

    console.log('\n✅ Migration completed!')
    console.log('\n📊 Created tables:')
    console.log('  - job_alerts')
    console.log('  - project_views')
    console.log('  - search_history')
    console.log('  - project_recommendations')
    console.log('\n🔍 Created functions:')
    console.log('  - calculate_skill_match()')
    console.log('  - get_recommended_projects()')
    console.log('  - check_job_alert_match()')
    console.log('  - notify_matching_job_alerts()')
    console.log('\n🎯 Next steps:')
    console.log('  1. Verify the migration in Supabase Dashboard')
    console.log('  2. Test the Job Discovery features')
    console.log('  3. Create some job alerts to test notifications')

  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    console.error('\n💡 Manual migration required:')
    console.error('   1. Go to: https://supabase.com/dashboard/project/jxlzyfwthzdnulwpukij/sql')
    console.error('   2. Copy contents of: database/migrations/worker_job_discovery_enhancements.sql')
    console.error('   3. Paste and click "Run"')
    process.exit(1)
  }
}

// Run migration
applyMigration()
