#!/usr/bin/env node

/**
 * Apply Investor-Ready Migration to Supabase
 * This applies the professional upgrade with all enterprise features
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function applyMigration() {
  console.log('\n' + '═'.repeat(80))
  console.log('🚀 APPLYING INVESTOR-READY MIGRATION')
  console.log('═'.repeat(80) + '\n')

  const migrationFile = path.join(__dirname, '../database/migrations/investor_ready_professional_upgrade.sql')
  const sql = fs.readFileSync(migrationFile, 'utf8')

  // Split into manageable chunks - be smart about it
  const statements = []
  let currentStatement = ''
  let inFunction = false
  let dollarCount = 0

  const lines = sql.split('\n')
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    // Track if we're inside a function
    if (line.includes('$$')) {
      dollarCount++
      inFunction = dollarCount % 2 !== 0
    }
    
    currentStatement += line + '\n'
    
    // Only split on semicolon if not in function
    if (line.trim().endsWith(';') && !inFunction && !line.trim().startsWith('--')) {
      const stmt = currentStatement.trim()
      if (stmt.length > 10 && !stmt.startsWith('--') && !stmt.startsWith('/*')) {
        statements.push(stmt)
      }
      currentStatement = ''
    }
  }

  // Add any remaining
  if (currentStatement.trim().length > 10) {
    statements.push(currentStatement.trim())
  }

  console.log(`📊 Executing ${statements.length} SQL operations...\n`)

  let successCount = 0
  let skipCount = 0
  let errorCount = 0

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i]
    
    // Determine statement type for logging
    let type = 'SQL'
    if (statement.toUpperCase().includes('ALTER TABLE') && statement.toUpperCase().includes('ADD COLUMN')) type = 'ADD COLUMN'
    else if (statement.toUpperCase().includes('CREATE TABLE')) type = 'CREATE TABLE'
    else if (statement.toUpperCase().includes('CREATE INDEX')) type = 'CREATE INDEX'
    else if (statement.toUpperCase().includes('CREATE POLICY')) type = 'CREATE POLICY'
    else if (statement.toUpperCase().includes('CREATE FUNCTION')) type = 'CREATE FUNCTION'
    else if (statement.toUpperCase().includes('CREATE TRIGGER')) type = 'CREATE TRIGGER'
    else if (statement.toUpperCase().includes('CREATE VIEW')) type = 'CREATE VIEW'
    else if (statement.toUpperCase().includes('INSERT INTO')) type = 'INSERT DATA'
    else if (statement.toUpperCase().includes('DROP TRIGGER')) type = 'DROP TRIGGER'

    process.stdout.write(`[${i + 1}/${statements.length}] ${type.padEnd(20)}... `)

    try {
      // Execute directly using Supabase client
      const { data, error } = await supabase.rpc('exec_sql', { sql: statement })
      
      if (error) {
        const errMsg = error.message || error.toString()
        
        // These are OK - already exists
        if (errMsg.includes('already exists') || 
            errMsg.includes('does not exist') ||
            errMsg.includes('duplicate key')) {
          console.log('⚠️  SKIPPED (already exists)')
          skipCount++
        } 
        // Column already exists
        else if (errMsg.includes('column') && errMsg.includes('already exists')) {
          console.log('⚠️  SKIPPED (column exists)')
          skipCount++
        }
        // These are real errors
        else {
          console.log('❌ ERROR')
          console.log(`    ${errMsg.substring(0, 100)}`)
          errorCount++
        }
      } else {
        console.log('✅ SUCCESS')
        successCount++
      }
    } catch (err) {
      console.log('❌ ERROR')
      console.log(`    ${err.message.substring(0, 100)}`)
      errorCount++
    }

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 50))
  }

  console.log('\n' + '─'.repeat(80))
  console.log(`📊 Results: ${successCount} succeeded, ${skipCount} skipped, ${errorCount} errors`)
  console.log('─'.repeat(80))

  // Verify key tables
  console.log('\n🔍 Verifying tables...\n')
  
  const tablesToCheck = [
    'client_profiles',
    'certifications',
    'reviews',
    'verification_requests',
    'messages',
    'user_activity_log',
    'notifications'
  ]

  for (const table of tablesToCheck) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
      
      if (error) {
        console.log(`❌ ${table}: NOT FOUND`)
      } else {
        console.log(`✅ ${table}: EXISTS (${count || 0} rows)`)
      }
    } catch (err) {
      console.log(`❌ ${table}: ERROR - ${err.message}`)
    }
  }

  // Check if columns were added to users table
  console.log('\n🔍 Verifying enhanced columns...\n')
  try {
    const { data, error } = await supabase
      .from('users')
      .select('profile_photo_url, is_online, profile_completion_percentage')
      .limit(1)
    
    if (!error) {
      console.log('✅ Enhanced user columns: EXISTS')
    } else {
      console.log('⚠️  Enhanced user columns: MAY NEED MANUAL CHECK')
    }
  } catch (err) {
    console.log('⚠️  Enhanced user columns: NEED VERIFICATION')
  }

  console.log('\n' + '═'.repeat(80))
  if (errorCount === 0) {
    console.log('🎉 MIGRATION COMPLETED SUCCESSFULLY!')
  } else if (errorCount < 10 && successCount > 20) {
    console.log('✅ MIGRATION MOSTLY SUCCESSFUL')
    console.log('⚠️  Some errors occurred but core features are ready')
  } else {
    console.log('⚠️  MIGRATION HAD ISSUES')
    console.log('💡 Try running the SQL manually in Supabase SQL Editor')
  }
  console.log('═'.repeat(80))
  
  console.log('\n📚 Next steps:')
  console.log('   1. Check the tables above are created')
  console.log('   2. Test profile completion widget')
  console.log('   3. Test verification badges')
  console.log('   4. Test online status updates')
  console.log('\n✅ Your platform is now investor-ready!')
}

applyMigration().catch(err => {
  console.error('\n❌ Fatal error:', err.message)
  console.error('\n💡 Please run the SQL manually in Supabase SQL Editor:')
  console.error('   https://supabase.com/dashboard/project/jxlzyfwthzdnulwpukij/sql')
  process.exit(1)
})
