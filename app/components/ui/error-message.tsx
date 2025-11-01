import { AlertCircle, XCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ErrorMessageProps {
  title?: string
  message: string
  type?: 'error' | 'warning' | 'info'
  onRetry?: () => void
  className?: string
}

export function ErrorMessage({
  title,
  message,
  type = 'error',
  onRetry,
  className,
}: ErrorMessageProps) {
  const config = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: XCircle,
      iconColor: 'text-red-600',
      textColor: 'text-red-900',
      buttonColor: 'bg-red-600 hover:bg-red-700',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: AlertTriangle,
      iconColor: 'text-yellow-600',
      textColor: 'text-yellow-900',
      buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: Info,
      iconColor: 'text-blue-600',
      textColor: 'text-blue-900',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
    },
  }

  const { bg, border, icon: Icon, iconColor, textColor, buttonColor } = config[type]

  return (
    <div className={cn('rounded-lg border p-4', bg, border, className)}>
      <div className="flex gap-3">
        <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', iconColor)} />
        <div className="flex-1">
          {title && (
            <h3 className={cn('font-semibold mb-1', textColor)}>{title}</h3>
          )}
          <p className={cn('text-sm', textColor)}>{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className={cn(
                'mt-3 rounded-md px-3 py-1.5 text-sm font-medium text-white',
                buttonColor
              )}
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export function ErrorBoundaryFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="max-w-md w-full">
        <ErrorMessage
          title="Something went wrong"
          message={error.message || 'An unexpected error occurred. Please try again.'}
          type="error"
          onRetry={reset}
        />
      </div>
    </div>
  )
}

