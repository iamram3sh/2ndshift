'use client'

import { MoreVertical, User, Calendar, IndianRupee, Tag } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { KanbanCard } from './KanbanBoard'

interface TaskListCardProps {
  card: KanbanCard
  onClick?: () => void
  onAction?: (action: string, card: KanbanCard) => void
  className?: string
}

export function TaskListCard({ card, onClick, onAction, className }: TaskListCardProps) {
  return (
    <div
      className={cn(
        'bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-semibold text-slate-900 flex-1">{card.title}</h4>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onAction?.('more', card)
          }}
          className="p-1 hover:bg-slate-100 rounded"
        >
          <MoreVertical className="w-4 h-4 text-slate-600" />
        </button>
      </div>

      {card.description && (
        <p className="text-xs text-slate-600 mb-3 line-clamp-2">{card.description}</p>
      )}

      {/* Meta Info */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-3">
        {card.budget && (
          <div className="flex items-center gap-1">
            <IndianRupee className="w-3 h-3" />
            <span>{card.budget.toLocaleString()}</span>
          </div>
        )}
        {card.date && (
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{card.date}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      {card.tags && card.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {card.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs"
            >
              {tag}
            </span>
          ))}
          {card.tags.length > 3 && (
            <span className="px-2 py-0.5 text-slate-500 text-xs">
              +{card.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Avatars */}
      {card.avatars && card.avatars.length > 0 && (
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {card.avatars.slice(0, 3).map((avatar, idx) => (
              <div
                key={idx}
                className="w-6 h-6 rounded-full bg-slate-300 border-2 border-white flex items-center justify-center"
              >
                {avatar ? (
                  <img src={avatar} alt="" className="w-full h-full rounded-full" />
                ) : (
                  <User className="w-3 h-3 text-slate-600" />
                )}
              </div>
            ))}
          </div>
          {card.avatars.length > 3 && (
            <span className="text-xs text-slate-500">+{card.avatars.length - 3}</span>
          )}
        </div>
      )}
    </div>
  )
}
