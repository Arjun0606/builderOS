import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getActivities } from '@/lib/activity-feed'

/**
 * GET /api/activities
 * Get recent activities for the organization
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
    const limit = parseInt(searchParams.get('limit') || '20')
    const type = searchParams.get('type')
    const userId = searchParams.get('userId')
    
    // Get activities
    const activities = await getActivities(userProfile.organization_id, {
      limit,
      type: type as any,
      userId: userId || undefined,
    })
    
    return NextResponse.json({ activities, count: activities.length })
  } catch (error: any) {
    console.error('Get activities error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

