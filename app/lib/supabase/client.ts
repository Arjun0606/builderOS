import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'

/**
 * Create a Supabase client for client-side operations
 * Used in Client Components and client-side API calls
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

