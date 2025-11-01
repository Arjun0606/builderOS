import { createClient } from '@/lib/supabase/server'

/**
 * Activity Feed System
 * Shows recent activities and updates in the organization
 */

export interface Activity {
  id: string
  type: 'case' | 'client' | 'document' | 'court_date' | 'time_entry' | 'user'
  action: 'created' | 'updated' | 'deleted' | 'uploaded' | 'completed'
  title: string
  description: string
  user: {
    id: string
    full_name: string
    email: string
  }
  resource_id?: string
  created_at: string
}

/**
 * Get recent activities for an organization
 */
export async function getActivities(
  organizationId: string,
  options?: {
    limit?: number
    type?: Activity['type']
    userId?: string
  }
): Promise<Activity[]> {
  const supabase = await createClient()
  const activities: Activity[] = []
  
  const limit = options?.limit || 20
  
  // Fetch recent cases
  const { data: cases } = await supabase
    .from('cases')
    .select('id, case_number, title, created_at, created_by, users!cases_created_by_fkey(id, full_name, email)')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (cases) {
    activities.push(
      ...cases.map((c: any) => ({
        id: `case-${c.id}`,
        type: 'case' as const,
        action: 'created' as const,
        title: `New case: ${c.title}`,
        description: `Case #${c.case_number} was created`,
        user: c.users,
        resource_id: c.id,
        created_at: c.created_at,
      }))
    )
  }
  
  // Fetch recent clients
  const { data: clients } = await supabase
    .from('clients')
    .select('id, name, email, created_at, created_by, users!clients_created_by_fkey(id, full_name, email)')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (clients) {
    activities.push(
      ...clients.map((c: any) => ({
        id: `client-${c.id}`,
        type: 'client' as const,
        action: 'created' as const,
        title: `New client: ${c.name}`,
        description: c.email ? `Client added: ${c.email}` : 'Client added',
        user: c.users,
        resource_id: c.id,
        created_at: c.created_at,
      }))
    )
  }
  
  // Fetch recent documents
  const { data: documents } = await supabase
    .from('documents')
    .select('id, filename, created_at, uploaded_by, users!documents_uploaded_by_fkey(id, full_name, email)')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (documents) {
    activities.push(
      ...documents.map((d: any) => ({
        id: `document-${d.id}`,
        type: 'document' as const,
        action: 'uploaded' as const,
        title: `Document uploaded: ${d.filename}`,
        description: 'New document added',
        user: d.users,
        resource_id: d.id,
        created_at: d.created_at,
      }))
    )
  }
  
  // Fetch recent court dates
  const { data: courtDates } = await supabase
    .from('court_dates')
    .select('id, title, hearing_date, created_at, created_by, users!court_dates_created_by_fkey(id, full_name, email)')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (courtDates) {
    activities.push(
      ...courtDates.map((cd: any) => ({
        id: `court-date-${cd.id}`,
        type: 'court_date' as const,
        action: 'created' as const,
        title: `Court date scheduled: ${cd.title}`,
        description: `Hearing on ${new Date(cd.hearing_date).toLocaleDateString()}`,
        user: cd.users,
        resource_id: cd.id,
        created_at: cd.created_at,
      }))
    )
  }
  
  // Sort all activities by created_at
  activities.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
  
  // Apply filters
  let filtered = activities
  
  if (options?.type) {
    filtered = filtered.filter(a => a.type === options.type)
  }
  
  if (options?.userId) {
    filtered = filtered.filter(a => a.user.id === options.userId)
  }
  
  // Return top N
  return filtered.slice(0, limit)
}

/**
 * Get activity stats for dashboard
 */
export async function getActivityStats(organizationId: string) {
  const supabase = await createClient()
  
  // Get counts for last 7 days
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  
  const [
    { count: newCases },
    { count: newClients },
    { count: newDocuments },
    { count: newCourtDates },
  ] = await Promise.all([
    supabase
      .from('cases')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .gte('created_at', sevenDaysAgo.toISOString()),
    supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .gte('created_at', sevenDaysAgo.toISOString()),
    supabase
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .gte('created_at', sevenDaysAgo.toISOString()),
    supabase
      .from('court_dates')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .gte('created_at', sevenDaysAgo.toISOString()),
  ])
  
  return {
    newCases: newCases || 0,
    newClients: newClients || 0,
    newDocuments: newDocuments || 0,
    newCourtDates: newCourtDates || 0,
    total: (newCases || 0) + (newClients || 0) + (newDocuments || 0) + (newCourtDates || 0),
  }
}

