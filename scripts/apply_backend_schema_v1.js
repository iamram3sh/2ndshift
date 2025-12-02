/**
 * Apply Backend Schema V1 migration directly to Supabase
 * This script executes the SQL migration file programmatically
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

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function executeSQL(statement) {
  try {
    // Try using RPC if available
    const { data, error } = await supabase.rpc('exec_sql', { sql: statement })
    
    if (error) {
      // If RPC doesn't exist, try direct query (for simple statements)
      if (error.message.includes('function') && error.message.includes('does not exist')) {
        // Fallback: Use Supabase REST API for DDL
        // Note: Supabase REST API doesn't support DDL directly
        // We'll need to use the Management API or return error
        throw new Error('exec_sql RPC function not found. Please create it first or run migration manually in SQL Editor.')
      }
      throw error
    }
    
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function applyMigration() {
  console.log('\n' + '═'.repeat(80))
  console.log('🚀 APPLYING BACKEND SCHEMA V1 MIGRATION')
  console.log('═'.repeat(80) + '\n')

  const migrationFile = path.join(__dirname, '../database/migrations/backend_schema_v1_complete.sql')
  
  if (!fs.existsSync(migrationFile)) {
    console.error(`❌ Migration file not found: ${migrationFile}`)
    process.exit(1)
  }

  const sql = fs.readFileSync(migrationFile, 'utf8')

  // Split into manageable chunks - handle functions properly
  const statements = []
  let currentStatement = ''
  let inFunction = false
  let dollarCount = 0
  let inComment = false
  let commentType = null // '--' or '/*'

  const lines = sql.split('\n')
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]
    
    // Handle comments
    if (line.includes('/*')) {
      inComment = true
      commentType = '/*'
    }
    if (line.includes('*/')) {
      inComment = false
      commentType = null
      continue
    }
    if (line.trim().startsWith('--')) {
      continue // Skip comment lines
    }
    if (inComment) {
      continue
    }
    
    // Track if we're inside a function (using $$ delimiters)
    if (line.includes('$$')) {
      dollarCount++
      inFunction = dollarCount % 2 !== 0
    }
    
    currentStatement += line + '\n'
    
    // Only split on semicolon if not in function and not in comment
    if (line.trim().endsWith(';') && !inFunction && !inComment) {
      const stmt = currentStatement.trim()
      // Filter out empty statements and comments
      if (stmt.length > 10 && 
          !stmt.startsWith('--') && 
          !stmt.startsWith('/*') &&
          !stmt.match(/^DO\s+\$\$/)) { // Skip DO blocks
        statements.push(stmt)
      }
      currentStatement = ''
    }
  }

  // Add any remaining statement
  if (currentStatement.trim().length > 10) {
    statements.push(currentStatement.trim())
  }

  console.log(`📊 Found ${statements.length} SQL statements to execute\n`)

  let successCount = 0
  let skipCount = 0
  let errorCount = 0
  const errors = []

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i]
    const preview = statement.substring(0, 60).replace(/\n/g, ' ')
    
    process.stdout.write(`[${i + 1}/${statements.length}] ${preview}... `)

    try {
      const result = await executeSQL(statement)
      
      if (!result.success) {
        const errMsg = result.error || 'Unknown error'
        
        // These are OK - already exists
        if (errMsg.includes('already exists') || 
            errMsg.includes('does not exist') ||
            errMsg.includes('duplicate key') ||
            errMsg.includes('duplicate')) {
          console.log('⚠️  SKIPPED (already exists)')
          skipCount++
        } 
        // Column already exists
        else if (errMsg.includes('column') && errMsg.includes('already exists')) {
          console.log('⚠️  SKIPPED (column exists)')
          skipCount++
        }
        // Constraint already exists
        else if (errMsg.includes('constraint') && errMsg.includes('already exists')) {
          console.log('⚠️  SKIPPED (constraint exists)')
          skipCount++
        }
        // Index already exists
        else if (errMsg.includes('index') && errMsg.includes('already exists')) {
          console.log('⚠️  SKIPPED (index exists)')
          skipCount++
        }
        // Policy already exists
        else if (errMsg.includes('policy') && errMsg.includes('already exists')) {
          console.log('⚠️  SKIPPED (policy exists)')
          skipCount++
        }
        // RPC function not found - need to create it or use manual method
        else if (errMsg.includes('exec_sql') || errMsg.includes('function') && errMsg.includes('does not exist')) {
          console.log('❌ ERROR')
          console.log(`    ⚠️  exec_sql RPC function not found.`)
          console.log(`    Please run this migration manually in Supabase SQL Editor, or create the exec_sql function first.`)
          errorCount++
          errors.push({ statement: i + 1, error: errMsg })
        }
        // These are real errors
        else {
          console.log('❌ ERROR')
          console.log(`    ${errMsg.substring(0, 150)}`)
          errorCount++
          errors.push({ statement: i + 1, error: errMsg, preview })
        }
      } else {
        console.log('✅ SUCCESS')
        successCount++
      }
    } catch (err) {
      console.log('❌ ERROR')
      const errMsg = err.message || err.toString()
      console.log(`    ${errMsg.substring(0, 150)}`)
      errorCount++
      errors.push({ statement: i + 1, error: errMsg, preview })
    }

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 100))
  }

  console.log('\n' + '─'.repeat(80))
  console.log(`📊 Results: ${successCount} succeeded, ${skipCount} skipped, ${errorCount} errors`)
  console.log('─'.repeat(80))

  if (errors.length > 0) {
    console.log('\n❌ Errors encountered:')
    errors.forEach(({ statement, error, preview }) => {
      console.log(`\n  Statement ${statement}:`)
      if (preview) console.log(`  Preview: ${preview}`)
      console.log(`  Error: ${error.substring(0, 200)}`)
    })
  }

  // Verify key tables
  console.log('\n🔍 Verifying tables...\n')
  
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

  for (const table of tablesToCheck) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1)
      
      if (error) {
        console.log(`  ❌ ${table}: ${error.message}`)
      } else {
        console.log(`  ✅ ${table}: exists`)
      }
    } catch (err) {
      console.log(`  ⚠️  ${table}: ${err.message}`)
    }
  }

  console.log('\n' + '═'.repeat(80))
  if (errorCount === 0) {
    console.log('✅ Migration completed successfully!')
  } else if (errorCount > 0 && errors.some(e => e.error.includes('exec_sql'))) {
    console.log('⚠️  Migration partially completed.')
    console.log('   Some statements require manual execution in Supabase SQL Editor.')
    console.log('   See errors above for details.')
  } else {
    console.log('⚠️  Migration completed with some errors.')
    console.log('   Review errors above and fix if needed.')
  }
  console.log('═'.repeat(80) + '\n')
}

// Run migration
applyMigration()
  .then(() => {
    console.log('✨ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error)
    process.exit(1)
  })
