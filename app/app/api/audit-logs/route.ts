import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getAuditLogs } from '@/lib/audit-log'

/**
 * GET /api/audit-logs
 * Get audit logs for the organization
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get user's organization
    const { data: userProfile } = await supabase
      .from('users')
      .select('organization_id')
      .eq('id', user.id)
      .single()
    
    if (!userProfile?.organization_id) {
      return NextResponse.json(
        { error: 'No organization found' },
        { status: 400 }
      )
    }
    
    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const action = searchParams.get('action')
    const userId = searchParams.get('userId')
    const resource = searchParams.get('resource')
    
    // Get audit logs
    const logs = await getAuditLogs(userProfile.organization_id, {
      limit,
      offset,
      action: action as any,
      userId: userId || undefined,
      resource: resource || undefined,
    })
    
    return NextResponse.json({ logs, count: logs.length })
  } catch (error: any) {
    console.error('Get audit logs error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

