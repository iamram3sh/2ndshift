'use client'

import { useState } from 'react'
import { MoreVertical, User, Calendar, IndianRupee } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TaskListCard } from './TaskListCard'

export interface KanbanCard {
  id: string
  title: string
  description?: string
  budget?: number
  date?: string
  avatars?: string[]
  tags?: string[]
  meta?: Record<string, any>
}

export interface KanbanColumn {
  id: string
  name: string
  cards: KanbanCard[]
}

interface KanbanBoardProps {
  columns: KanbanColumn[]
  onCardMove?: (cardId: string, fromColumnId: string, toColumnId: string) => void
  onCardClick?: (card: KanbanCard) => void
  className?: string
}

export function KanbanBoard({
  columns,
  onCardMove,
  onCardClick,
  className,
}: KanbanBoardProps) {
  const [draggedCard, setDraggedCard] = useState<{ card: KanbanCard; columnId: string } | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)

  const handleDragStart = (card: KanbanCard, columnId: string) => {
    setDraggedCard({ card, columnId })
  }

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    setDragOverColumn(columnId)
  }

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault()
    if (draggedCard && draggedCard.columnId !== targetColumnId) {
      onCardMove?.(draggedCard.card.id, draggedCard.columnId, targetColumnId)
    }
    setDraggedCard(null)
    setDragOverColumn(null)
  }

  const handleDragEnd = () => {
    setDraggedCard(null)
    setDragOverColumn(null)
  }

  return (
    <div className={cn('flex gap-4 overflow-x-auto pb-4', className)}>
      {columns.map((column) => (
        <div
          key={column.id}
          className={cn(
            'flex-shrink-0 w-80 bg-slate-50 rounded-lg p-4',
            dragOverColumn === column.id && 'ring-2 ring-slate-900'
          )}
          onDragOver={(e) => handleDragOver(e, column.id)}
          onDrop={(e) => handleDrop(e, column.id)}
          onDragLeave={() => setDragOverColumn(null)}
        >
          {/* Column Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">{column.name}</h3>
              <p className="text-xs text-slate-500">{column.cards.length} items</p>
            </div>
            <button className="p-1 hover:bg-slate-200 rounded">
              <MoreVertical className="w-4 h-4 text-slate-600" />
            </button>
          </div>

          {/* Cards */}
          <div className="space-y-3">
            {column.cards.map((card) => (
              <div
                key={card.id}
                draggable
                onDragStart={() => handleDragStart(card, column.id)}
                onDragEnd={handleDragEnd}
                className="cursor-move"
              >
                <TaskListCard
                  card={card}
                  onClick={() => onCardClick?.(card)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
