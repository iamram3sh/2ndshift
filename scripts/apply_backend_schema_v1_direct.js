#!/usr/bin/env node

/**
 * Apply Backend Schema V1 Migration to Supabase
 * 
 * This script provides two options:
 * 1. Automatic execution (if exec_sql RPC function exists)
 * 2. Manual execution instructions (recommended for first-time setup)
 */

const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

// Extract project ref from URL
const projectRef = supabaseUrl.replace('https://', '').split('.')[0]

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function checkExecSQLFunction() {
  try {
    // Try to call the function with a simple query
    const { data, error } = await supabase.rpc('exec_sql', { sql: 'SELECT 1' })
    return !error
  } catch {
    return false
  }
}

async function applyMigrationAutomatically() {
  console.log('\n' + '═'.repeat(80))
  console.log('🚀 APPLYING BACKEND SCHEMA V1 MIGRATION (AUTOMATIC)')
  console.log('═'.repeat(80) + '\n')

  const migrationFile = path.join(__dirname, '../database/migrations/backend_schema_v1_complete.sql')
  
  if (!fs.existsSync(migrationFile)) {
    console.error(`❌ Migration file not found: ${migrationFile}`)
    process.exit(1)
  }

  const sql = fs.readFileSync(migrationFile, 'utf8')

  // For automatic execution, we'll try to execute the entire SQL file
  // Supabase SQL Editor can handle the full file
  console.log('📄 Reading migration file...')
  console.log(`📊 File size: ${(sql.length / 1024).toFixed(2)} KB\n`)

  try {
    // Try executing via RPC
    const { data, error } = await supabase.rpc('exec_sql', { sql })
    
    if (error) {
      throw error
    }

    console.log('✅ Migration executed successfully!')
    return true
  } catch (error) {
    console.log('❌ Automatic execution failed:', error.message)
    return false
  }
}

function showManualInstructions() {
  console.log('\n' + '═'.repeat(80))
  console.log('📝 MANUAL MIGRATION INSTRUCTIONS (RECOMMENDED)')
  console.log('═'.repeat(80) + '\n')
  
  console.log('The Supabase SQL Editor is the most reliable way to apply migrations.\n')
  
  console.log('Step 1: Open Supabase SQL Editor')
  console.log(`   🔗 https://supabase.com/dashboard/project/${projectRef}/sql/new\n`)
  
  console.log('Step 2: Open the migration file')
  console.log('   📁 database/migrations/backend_schema_v1_complete.sql\n')
  
  console.log('Step 3: Copy ALL content (Ctrl+A, Ctrl+C)\n')
  
  console.log('Step 4: Paste into SQL Editor and click "RUN" (or Ctrl+Enter)\n')
  
  console.log('Step 5: Wait for completion (~1-2 minutes)\n')
  
  console.log('Step 6: Verify tables were created\n')
  
  console.log('✅ That\'s it! Your backend schema will be ready.\n')
  
  console.log('═'.repeat(80))
  console.log('📋 What this migration creates:\n')
  console.log('   ✅ Enhanced users table (password_hash, profile_complete, etc.)')
  console.log('   ✅ Profiles table (worker profiles with skills, scores)')
  console.log('   ✅ Categories table (hierarchical categories)')
  console.log('   ✅ Microtasks table (catalog of microtasks)')
  console.log('   ✅ Jobs table (enhanced from projects)')
  console.log('   ✅ Applications table (proposals)')
  console.log('   ✅ Assignments table (job assignments)')
  console.log('   ✅ Shift Credits tables (balance, transactions)')
  console.log('   ✅ Escrows table (escrow management)')
  console.log('   ✅ Commissions table (commission tracking)')
  console.log('   ✅ Verifications table (user verifications)')
  console.log('   ✅ Notifications table (user notifications)')
  console.log('   ✅ Missing Task Requests table')
  console.log('   ✅ Platform Config table')
  console.log('   ✅ All indexes, constraints, and RLS policies')
  console.log('   ✅ Database functions (reserve_credits, release_credits)')
  console.log('   ✅ Triggers (auto-initialize credits, update timestamps)\n')
  
  console.log('═'.repeat(80) + '\n')
}

async function verifyMigration() {
  console.log('🔍 Verifying migration...\n')
  
  const tablesToCheck = [
    'profiles',
    'categories',
    'microtasks',
    'jobs',
    'applications',
    'assignments',
    'shift_credits',
    'credit_transactions',
    'escrows',
    'commissions',
    'verifications',
    'notifications',
    'platform_config'
  ]

  let allExist = true

  for (const table of tablesToCheck) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1)
      
      if (error) {
        console.log(`  ❌ ${table}: ${error.message}`)
        allExist = false
      } else {
        console.log(`  ✅ ${table}: exists`)
      }
    } catch (err) {
      console.log(`  ⚠️  ${table}: ${err.message}`)
      allExist = false
    }
  }

  return allExist
}

async function main() {
  console.log('\n' + '═'.repeat(80))
  console.log('🎯 BACKEND SCHEMA V1 MIGRATION TOOL')
  console.log('═'.repeat(80))

  // Check if exec_sql function exists
  const hasExecSQL = await checkExecSQLFunction()
  
  if (hasExecSQL) {
    console.log('\n✅ exec_sql RPC function found. Attempting automatic execution...\n')
    const success = await applyMigrationAutomatically()
    
    if (success) {
      await verifyMigration()
      console.log('\n✅ Migration completed successfully!')
      return
    }
  } else {
    console.log('\n⚠️  exec_sql RPC function not found.')
    console.log('   For first-time setup, manual execution is recommended.\n')
  }

  // Show manual instructions
  showManualInstructions()

  // Ask if user wants to verify
  console.log('💡 After running the migration manually, you can verify it worked by running:')
  console.log('   node scripts/apply_backend_schema_v1_direct.js --verify\n')
}

// Handle command line arguments
const args = process.argv.slice(2)

if (args.includes('--verify')) {
  verifyMigration()
    .then((allExist) => {
      if (allExist) {
        console.log('\n✅ All tables exist! Migration successful.')
      } else {
        console.log('\n⚠️  Some tables are missing. Please check the migration.')
      }
      process.exit(allExist ? 0 : 1)
    })
    .catch((error) => {
      console.error('\n❌ Verification failed:', error)
      process.exit(1)
    })
} else {
  main()
    .then(() => {
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n❌ Error:', error)
      process.exit(1)
    })
}
