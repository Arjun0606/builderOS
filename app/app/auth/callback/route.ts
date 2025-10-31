import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Auth callback route
 * Handles magic link authentication callback from Supabase
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Successful authentication
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Authentication failed - redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}

