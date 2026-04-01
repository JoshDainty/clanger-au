import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  message: string
  actionLabel?: string
  actionTo?: string
  onAction?: () => void
}

export default function EmptyState({ icon: Icon, title, message, actionLabel, actionTo, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-6">
      <div className="w-14 h-14 rounded-2xl bg-bg-card border border-border flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-text-tertiary" />
      </div>
      <h3 className="text-base font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-sm text-text-tertiary max-w-xs mb-5">{message}</p>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="inline-flex items-center gap-2 h-10 px-5 bg-accent hover:bg-accent-dark text-white text-sm font-bold rounded-lg transition-colors"
        >
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && !actionTo && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 h-10 px-5 bg-accent hover:bg-accent-dark text-white text-sm font-bold rounded-lg transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
