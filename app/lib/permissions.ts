/**
 * User Permissions & Role-Based Access Control (RBAC)
 * 
 * Roles:
 * - admin: Full access to everything
 * - senior_lawyer: Can manage cases, clients, team members
 * - lawyer: Can manage own cases and clients
 * - paralegal: Can view and assist on cases
 * - staff: Limited access (billing, admin tasks)
 */

export type UserRole = 'admin' | 'senior_lawyer' | 'lawyer' | 'paralegal' | 'staff'

export interface Permission {
  resource: string
  action: 'create' | 'read' | 'update' | 'delete' | 'manage'
}

// Define permissions for each role
const rolePermissions: Record<UserRole, Permission[]> = {
  admin: [
    { resource: '*', action: 'manage' }, // Full access to everything
  ],
  senior_lawyer: [
    { resource: 'cases', action: 'manage' },
    { resource: 'clients', action: 'manage' },
    { resource: 'documents', action: 'manage' },
    { resource: 'team', action: 'read' },
    { resource: 'billing', action: 'read' },
    { resource: 'templates', action: 'manage' },
    { resource: 'ai', action: 'manage' },
  ],
  lawyer: [
    { resource: 'cases', action: 'create' },
    { resource: 'cases', action: 'read' },
    { resource: 'cases', action: 'update' }, // Can only update own cases
    { resource: 'clients', action: 'create' },
    { resource: 'clients', action: 'read' },
    { resource: 'clients', action: 'update' },
    { resource: 'documents', action: 'manage' },
    { resource: 'templates', action: 'read' },
    { resource: 'ai', action: 'read' },
  ],
  paralegal: [
    { resource: 'cases', action: 'read' },
    { resource: 'clients', action: 'read' },
    { resource: 'documents', action: 'read' },
    { resource: 'documents', action: 'create' },
    { resource: 'templates', action: 'read' },
    { resource: 'ai', action: 'read' },
  ],
  staff: [
    { resource: 'billing', action: 'read' },
    { resource: 'clients', action: 'read' },
    { resource: 'cases', action: 'read' },
  ],
}

/**
 * Check if a user has permission to perform an action on a resource
 */
export function hasPermission(
  userRole: UserRole,
  resource: string,
  action: 'create' | 'read' | 'update' | 'delete' | 'manage'
): boolean {
  const permissions = rolePermissions[userRole]
  
  // Check for full admin access
  if (permissions.some(p => p.resource === '*' && p.action === 'manage')) {
    return true
  }
  
  // Check for specific permission
  return permissions.some(p => {
    if (p.resource !== resource) return false
    
    // 'manage' implies all actions
    if (p.action === 'manage') return true
    
    // Exact action match
    return p.action === action
  })
}

/**
 * Check if user can access a specific case
 */
export function canAccessCase(
  userRole: UserRole,
  userId: string,
  case: { assigned_lawyers?: string[] }
): boolean {
  // Admins and senior lawyers can access all cases
  if (userRole === 'admin' || userRole === 'senior_lawyer') {
    return true
  }
  
  // Lawyers and paralegals can only access cases they're assigned to
  if (userRole === 'lawyer' || userRole === 'paralegal') {
    return case.assigned_lawyers?.includes(userId) ?? false
  }
  
  // Staff have read-only access to all cases
  if (userRole === 'staff') {
    return true
  }
  
  return false
}

/**
 * Check if user can modify a case
 */
export function canModifyCase(
  userRole: UserRole,
  userId: string,
  case: { assigned_lawyers?: string[]; created_by?: string }
): boolean {
  // Admins and senior lawyers can modify all cases
  if (userRole === 'admin' || userRole === 'senior_lawyer') {
    return true
  }
  
  // Lawyers can only modify cases they're assigned to or created
  if (userRole === 'lawyer') {
    return (
      case.assigned_lawyers?.includes(userId) ||
      case.created_by === userId
    )
  }
  
  return false
}

/**
 * Get allowed actions for a user on a resource
 */
export function getAllowedActions(
  userRole: UserRole,
  resource: string
): ('create' | 'read' | 'update' | 'delete')[] {
  const actions: ('create' | 'read' | 'update' | 'delete')[] = []
  
  const allActions: ('create' | 'read' | 'update' | 'delete')[] = [
    'create',
    'read',
    'update',
    'delete',
  ]
  
  for (const action of allActions) {
    if (hasPermission(userRole, resource, action)) {
      actions.push(action)
    }
  }
  
  return actions
}

/**
 * Permission error messages
 */
export function getPermissionErrorMessage(resource: string, action: string): string {
  return `You don't have permission to ${action} ${resource}. Please contact your administrator.`
}

