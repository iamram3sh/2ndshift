import { ReactNode } from 'react'
import { clsx } from 'clsx'
import { 
  AlertCircle, XCircle, WifiOff, ServerCrash, 
  RefreshCw, Home, ArrowLeft, Mail
} from 'lucide-react'
import { Button } from './Button'
import Link from 'next/link'

interface ErrorStateProps {
  title?: string
  message?: string
  icon?: ReactNode | 'alert' | 'error' | 'offline' | 'server'
  onRetry?: () => void
  onGoBack?: () => void
  showHomeButton?: boolean
  showContactSupport?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const iconMap = {
  alert: AlertCircle,
  error: XCircle,
  offline: WifiOff,
  server: ServerCrash
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An error occurred while loading this content. Please try again.',
  icon = 'alert',
  onRetry,
  onGoBack,
  showHomeButton = false,
  showContactSupport = false,
  className,
  size = 'md'
}: ErrorStateProps) {
  const IconComponent = typeof icon === 'string' ? iconMap[icon] : null

  const sizes = {
    sm: {
      icon: 'w-12 h-12',
      title: 'text-base',
      message: 'text-xs',
      padding: 'py-8 px-4'
    },
    md: {
      icon: 'w-20 h-20',
      title: 'text-xl',
      message: 'text-sm',
      padding: 'py-12 px-6'
    },
    lg: {
      icon: 'w-32 h-32',
      title: 'text-3xl',
      message: 'text-base',
      padding: 'py-16 px-8'
    }
  }

  return (
    <div className={clsx(
      'flex flex-col items-center justify-center text-center',
      sizes[size].padding,
      className
    )}>
      <div className={clsx(
        'mb-4 text-red-500 dark:text-red-400',
        sizes[size].icon
      )}>
        {IconComponent ? (
          <IconComponent className="w-full h-full" />
        ) : (
          icon
        )}
      </div>
      
      <h3 className={clsx(
        'font-bold text-slate-900 dark:text-white mb-2',
        sizes[size].title
      )}>
        {title}
      </h3>
      
      <p className={clsx(
        'text-slate-600 dark:text-slate-400 max-w-md mb-6',
        sizes[size].message
      )}>
        {message}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        {onRetry && (
          <Button
            variant="primary"
            icon={<RefreshCw className="w-4 h-4" />}
            onClick={onRetry}
          >
            Try Again
          </Button>
        )}
        
        {onGoBack && (
          <Button
            variant="outline"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={onGoBack}
          >
            Go Back
          </Button>
        )}
        
        {showHomeButton && (
          <Link href="/">
            <Button
              variant="ghost"
              icon={<Home className="w-4 h-4" />}
            >
              Go Home
            </Button>
          </Link>
        )}
        
        {showContactSupport && (
          <Link href="/contact">
            <Button
              variant="ghost"
              icon={<Mail className="w-4 h-4" />}
            >
              Contact Support
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}

interface NetworkErrorProps {
  onRetry?: () => void
}

export function NetworkError({ onRetry }: NetworkErrorProps) {
  return (
    <ErrorState
      icon="offline"
      title="No Internet Connection"
      message="Please check your connection and try again."
      onRetry={onRetry}
    />
  )
}

interface NotFoundProps {
  resource?: string
  onGoBack?: () => void
}

export function NotFound({ resource = 'page', onGoBack }: NotFoundProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            404
          </h1>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            {resource.charAt(0).toUpperCase() + resource.slice(1)} Not Found
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            Sorry, we couldn&apos;t find the {resource} you&apos;re looking for.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {onGoBack && (
            <Button
              variant="outline"
              icon={<ArrowLeft className="w-4 h-4" />}
              onClick={onGoBack}
            >
              Go Back
            </Button>
          )}
          <Link href="/">
            <Button
              variant="primary"
              icon={<Home className="w-4 h-4" />}
            >
              Go to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

interface ServerErrorProps {
  statusCode?: number
  onRetry?: () => void
}

export function ServerError({ statusCode = 500, onRetry }: ServerErrorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <ServerCrash className="w-32 h-32 text-red-500 dark:text-red-400 mx-auto mb-6" />
          <h1 className="text-6xl font-bold text-slate-900 dark:text-white mb-4">
            {statusCode}
          </h1>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Server Error
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            Something went wrong on our end. We&apos;re working to fix it.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {onRetry && (
            <Button
              variant="primary"
              icon={<RefreshCw className="w-4 h-4" />}
              onClick={onRetry}
            >
              Try Again
            </Button>
          )}
          <Link href="/">
            <Button
              variant="outline"
              icon={<Home className="w-4 h-4" />}
            >
              Go to Homepage
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              variant="ghost"
              icon={<Mail className="w-4 h-4" />}
            >
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
