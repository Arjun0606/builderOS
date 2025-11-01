import { createClient } from '@/lib/supabase/server'

/**
 * Audit Log System
 * Tracks all important actions in the system for compliance and debugging
 */

export type AuditAction =
  | 'case.created'
  | 'case.updated'
  | 'case.deleted'
  | 'case.archived'
  | 'client.created'
  | 'client.updated'
  | 'client.deleted'
  | 'document.uploaded'
  | 'document.downloaded'
  | 'document.deleted'
  | 'user.login'
  | 'user.logout'
  | 'user.invited'
  | 'user.removed'
  | 'template.generated'
  | 'ai.query'
  | 'payment.created'
  | 'payment.succeeded'
  | 'settings.updated'

interface AuditLogEntry {
  userId: string
  organizationId: string
  action: AuditAction
  resource?: string // e.g., 'case:123', 'client:456'
  details?: Record<string, any>
  ipAddress?: string
  userAgent?: string
}

/**
 * Create an audit log entry
 */
export async function createAuditLog(entry: AuditLogEntry) {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase.from('audit_logs').insert({
      user_id: entry.userId,
      organization_id: entry.organizationId,
      action: entry.action,
      resource: entry.resource,
      details: entry.details,
      ip_address: entry.ipAddress,
      user_agent: entry.userAgent,
    })
    
    if (error) {
      console.error('Failed to create audit log:', error)
      // Don't throw - audit logs should never break the main flow
    }
  } catch (error) {
    console.error('Audit log error:', error)
    // Swallow errors silently
  }
}

/**
 * Get audit logs for an organization
 */
export async function getAuditLogs(
  organizationId: string,
  options?: {
    limit?: number
    offset?: number
    userId?: string
    action?: AuditAction
    resource?: string
    startDate?: Date
    endDate?: Date
  }
) {
  const supabase = await createClient()
  
  let query = supabase
    .from('audit_logs')
    .select('*, users(full_name, email)')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })
  
  if (options?.userId) {
    query = query.eq('user_id', options.userId)
  }
  
  if (options?.action) {
    query = query.eq('action', options.action)
  }
  
  if (options?.resource) {
    query = query.eq('resource', options.resource)
  }
  
  if (options?.startDate) {
    query = query.gte('created_at', options.startDate.toISOString())
  }
  
  if (options?.endDate) {
    query = query.lte('created_at', options.endDate.toISOString())
  }
  
  if (options?.limit) {
    query = query.limit(options.limit)
  }
  
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 50) - 1)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Get audit logs error:', error)
    return []
  }
  
  return data
}

/**
 * Helper to get user and organization context from request
 */
export async function getAuditContext(request?: Request) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }
  
  const { data: userProfile } = await supabase
    .from('users')
    .select('organization_id')
    .eq('id', user.id)
    .single()
  
  if (!userProfile?.organization_id) {
    return null
  }
  
  return {
    userId: user.id,
    organizationId: userProfile.organization_id,
    ipAddress: request?.headers.get('x-forwarded-for') || request?.headers.get('x-real-ip'),
    userAgent: request?.headers.get('user-agent'),
  }
}

/**
 * Middleware to automatically log API actions
 */
export function withAuditLog(action: AuditAction) {
  return async (handler: (request: Request) => Promise<Response>) => {
    return async (request: Request) => {
      const context = await getAuditContext(request)
      
      // Execute the handler
      const response = await handler(request)
      
      // Log the action (async, don't await)
      if (context) {
        createAuditLog({
          ...context,
          action,
        }).catch(() => {}) // Swallow errors
      }
      
      return response
    }
  }
}

