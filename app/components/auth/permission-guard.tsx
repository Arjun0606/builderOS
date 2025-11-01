'use client'

import { ReactNode } from 'react'
import { hasPermission, UserRole, getPermissionErrorMessage } from '@/lib/permissions'
import { ErrorMessage } from '@/components/ui/error-message'

interface PermissionGuardProps {
  userRole: UserRole
  resource: string
  action: 'create' | 'read' | 'update' | 'delete' | 'manage'
  children: ReactNode
  fallback?: ReactNode
}

/**
 * Component that conditionally renders children based on user permissions
 */
export function PermissionGuard({
  userRole,
  resource,
  action,
  children,
  fallback,
}: PermissionGuardProps) {
  const allowed = hasPermission(userRole, resource, action)
  
  if (!allowed) {
    if (fallback) {
      return <>{fallback}</>
    }
    
    return (
      <ErrorMessage
        title="Access Denied"
        message={getPermissionErrorMessage(resource, action)}
        type="warning"
      />
    )
  }
  
  return <>{children}</>
}

/**
 * Hook to check permissions in components
 */
export function usePermissions(userRole: UserRole) {
  return {
    can: (resource: string, action: 'create' | 'read' | 'update' | 'delete' | 'manage') =>
      hasPermission(userRole, resource, action),
    cannotMessage: (resource: string, action: string) =>
      getPermissionErrorMessage(resource, action),
  }
}

