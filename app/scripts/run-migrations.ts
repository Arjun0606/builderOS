#!/usr/bin/env ts-node

/**
 * Database Migration Runner
 * Run all SQL migrations on Supabase database
 * 
 * Usage: npx ts-node scripts/run-migrations.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing Supabase environment variables')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const MIGRATIONS = [
  'supabase/LEGALOS_SCHEMA.sql',
  'supabase/knowledge-base-migration.sql',
]

async function runMigration(filePath: string): Promise<void> {
  console.log(`\n📄 Running migration: ${filePath}`)
  
  const fullPath = path.join(process.cwd(), filePath)
  
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Migration file not found: ${fullPath}`)
    return
  }
  
  const sql = fs.readFileSync(fullPath, 'utf-8')
  
  // Split SQL file into individual statements
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))
  
  console.log(`   Found ${statements.length} statements`)
  
  let successCount = 0
  let errorCount = 0
  
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i]
    
    try {
      // Execute each statement
      const { error } = await supabase.rpc('exec_sql', { sql_query: statement + ';' })
      
      if (error) {
        // Some errors are expected (like "already exists"), just log them
        if (error.message.includes('already exists')) {
          console.log(`   ⚠️  Statement ${i + 1}: ${error.message.substring(0, 50)}...`)
        } else {
          console.error(`   ❌ Statement ${i + 1}: ${error.message}`)
          errorCount++
        }
      } else {
        successCount++
      }
    } catch (error: any) {
      console.error(`   ❌ Statement ${i + 1}: ${error.message}`)
      errorCount++
    }
  }
  
  console.log(`   ✅ Completed: ${successCount} successful, ${errorCount} errors`)
}

async function main() {
  console.log('🚀 LegalOS Database Migration Runner')
  console.log('====================================\n')
  console.log(`Supabase URL: ${supabaseUrl}`)
  
  for (const migration of MIGRATIONS) {
    await runMigration(migration)
  }
  
  console.log('\n✅ All migrations completed!')
  console.log('\n📊 Verifying database...')
  
  // Verify tables exist
  const { data: tables, error } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
  
  if (error) {
    console.error('❌ Error verifying database:', error.message)
  } else {
    console.log(`\n📋 Tables created: ${tables?.length || 0}`)
    tables?.slice(0, 10).forEach((table: any) => {
      console.log(`   - ${table.table_name}`)
    })
    if (tables && tables.length > 10) {
      console.log(`   ... and ${tables.length - 10} more`)
    }
  }
  
  console.log('\n🎉 Database setup complete!')
}

main().catch((error) => {
  console.error('❌ Migration failed:', error)
  process.exit(1)
})

