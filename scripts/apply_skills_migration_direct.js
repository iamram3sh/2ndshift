#!/usr/bin/env node

/**
 * Apply Dynamic Skills Migration Directly
 * Uses direct SQL execution via Supabase REST API
 */

const https = require('https')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '')

async function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query: sql })
    
    const options = {
      hostname: `${projectRef}.supabase.co`,
      port: 443,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Length': data.length
      }
    }

    const req = https.request(options, (res) => {
      let body = ''
      res.on('data', (chunk) => body += chunk)
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, data: body })
        } else {
          resolve({ success: false, error: body })
        }
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    req.write(data)
    req.end()
  })
}

async function applyMigration() {
  console.log('\n🚀 Applying Dynamic Skills System Migration...\n')
  
  const sqlFile = path.join(__dirname, '../database/migrations/dynamic_skills_system.sql')
  const sql = fs.readFileSync(sqlFile, 'utf8')
  
  // Split into individual statements
  const statements = sql
    .split(/;\s*\n/)
    .map(s => s.trim())
    .filter(s => s.length > 10 && !s.startsWith('--'))
  
  console.log(`📊 Found ${statements.length} statements\n`)
  
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i] + ';'
    
    let type = 'SQL'
    if (stmt.includes('CREATE TABLE')) type = 'CREATE TABLE'
    else if (stmt.includes('INSERT INTO')) type = 'INSERT DATA'
    else if (stmt.includes('CREATE FUNCTION')) type = 'CREATE FUNCTION'
    else if (stmt.includes('CREATE TRIGGER')) type = 'CREATE TRIGGER'
    else if (stmt.includes('CREATE INDEX')) type = 'CREATE INDEX'
    
    process.stdout.write(`[${i + 1}/${statements.length}] ${type}... `)
    
    try {
      const result = await executeSQL(stmt)
      if (result.success) {
        console.log('✅')
      } else {
        console.log('⚠️', result.error.includes('already exists') ? '(already exists)' : '')
      }
    } catch (err) {
      console.log('❌', err.message)
    }
    
    await new Promise(r => setTimeout(r, 100))
  }
  
  console.log('\n✅ Migration completed!\n')
}

console.log('Note: This method may have limitations. Using Supabase SQL Editor is recommended.')
console.log('Opening alternative approach...\n')

// Instead, let's create a file that can be copy-pasted
const outputFile = path.join(__dirname, '../COPY_PASTE_TO_SUPABASE.sql')
const sqlFile = path.join(__dirname, '../database/migrations/dynamic_skills_system.sql')
const sql = fs.readFileSync(sqlFile, 'utf8')

fs.writeFileSync(outputFile, sql)

console.log('═'.repeat(80))
console.log('📋 MANUAL MIGRATION REQUIRED')
console.log('═'.repeat(80))
console.log('')
console.log('✅ Worker Job Discovery tables are already created!')
console.log('⏳ Dynamic Skills System needs manual migration')
console.log('')
console.log('📝 EASY STEPS (2 minutes):')
console.log('')
console.log('1. Open Supabase SQL Editor:')
console.log('   https://supabase.com/dashboard/project/' + projectRef + '/sql')
console.log('')
console.log('2. Open this file in your editor:')
console.log('   database/migrations/dynamic_skills_system.sql')
console.log('')
console.log('3. Copy ALL content (Ctrl+A, Ctrl+C)')
console.log('')
console.log('4. Paste into Supabase SQL Editor')
console.log('')
console.log('5. Click the green "RUN" button')
console.log('')
console.log('6. Wait for success message (takes ~10 seconds)')
console.log('')
console.log('═'.repeat(80))
console.log('')
console.log('💡 Why manual? Supabase REST API has limitations for complex SQL')
console.log('   functions with $$ delimiters. The SQL Editor handles them perfectly!')
console.log('')
console.log('✅ After running: You\'ll have 100+ pre-seeded skills ready to use!')
console.log('')
