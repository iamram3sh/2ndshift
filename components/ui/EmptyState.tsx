import { ReactNode } from 'react'
import { clsx } from 'clsx'
import { 
  Inbox, Search, FileText, Users, Briefcase, 
  AlertCircle, CheckCircle, XCircle, Package,
  FolderOpen, Mail, Calendar, Image, File
} from 'lucide-react'
import { Button } from './Button'

interface EmptyStateProps {
  icon?: ReactNode | 'inbox' | 'search' | 'file' | 'users' | 'briefcase' | 'folder' | 'mail' | 'calendar' | 'image' | 'package'
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: 'primary' | 'secondary' | 'outline'
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const iconMap = {
  inbox: Inbox,
  search: Search,
  file: FileText,
  users: Users,
  briefcase: Briefcase,
  folder: FolderOpen,
  mail: Mail,
  calendar: Calendar,
  image: Image,
  package: Package
}

export function EmptyState({
  icon = 'inbox',
  title,
  description,
  action,
  secondaryAction,
  className,
  size = 'md'
}: EmptyStateProps) {
  const IconComponent = typeof icon === 'string' ? iconMap[icon] : null

  const sizes = {
    sm: {
      icon: 'w-12 h-12',
      title: 'text-base',
      description: 'text-xs',
      padding: 'py-8 px-4'
    },
    md: {
      icon: 'w-20 h-20',
      title: 'text-lg',
      description: 'text-sm',
      padding: 'py-12 px-6'
    },
    lg: {
      icon: 'w-32 h-32',
      title: 'text-2xl',
      description: 'text-base',
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
        'mb-4 text-slate-300 dark:text-slate-600',
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
      
      {description && (
        <p className={clsx(
          'text-slate-600 dark:text-slate-400 max-w-md mb-6',
          sizes[size].description
        )}>
          {description}
        </p>
      )}
      
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          {action && (
            <Button
              variant={action.variant || 'primary'}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="ghost"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

interface NoResultsProps {
  searchQuery?: string
  onClear?: () => void
  suggestions?: string[]
}

export function NoResults({ searchQuery, onClear, suggestions }: NoResultsProps) {
  return (
    <div className="empty-state">
      <Search className="empty-state-icon" />
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
        No results found
      </h3>
      {searchQuery && (
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          We couldn&apos;t find anything matching &quot;<span className="font-semibold">{searchQuery}</span>&quot;
        </p>
      )}
      {suggestions && suggestions.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Try searching for:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
      {onClear && (
        <Button variant="outline" onClick={onClear}>
          Clear filters
        </Button>
      )}
    </div>
  )
}

interface ComingSoonProps {
  feature: string
  description?: string
  estimatedDate?: string
}

export function ComingSoon({ feature, description, estimatedDate }: ComingSoonProps) {
  return (
    <div className="empty-state">
      <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center mb-4">
        <Package className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
        {feature} Coming Soon!
      </h3>
      {description && (
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mb-4">
          {description}
        </p>
      )}
      {estimatedDate && (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">
          <Calendar className="w-4 h-4" />
          <span>Expected: {estimatedDate}</span>
        </div>
      )}
    </div>
  )
}
