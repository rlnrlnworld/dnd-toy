'use client'

import { useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'
import BoardCard, { CardStatus } from './BoardCard'
import { useSortable } from '@dnd-kit/sortable'

type CardItem = { id: string; title: string }

type ColumnMeta = { label: string; dot: string; surface: string; over: string; text: string }

const COLUMN_META: Record<CardStatus, ColumnMeta> = {
  todo: {
    label: '할 일',
    dot: 'bg-status-todo',
    surface: 'bg-status-todo-soft',
    over: 'border-status-todo',
    text: 'text-status-todo-ink',
  },
  doing: {
    label: '진행 중',
    dot: 'bg-status-doing',
    surface: 'bg-status-doing-soft',
    over: 'border-status-doing',
    text: 'text-status-doing-ink',
  },
  done: {
    label: '완료',
    dot: 'bg-status-done',
    surface: 'bg-status-done-soft',
    over: 'border-status-done',
    text: 'text-status-done-ink',
  },
}

export default function KanbanColumn({
  columnId,
  items,
  onAdd,
  onDelete,
}: {
  columnId: string
  items: CardItem[]
  onAdd: (text: string) => void
  onDelete?: (id: string) => void
}) {
  const [newCard, setNewCard] = useState('')
  const [invalid, setInvalid] = useState(false)

  const { setNodeRef, isOver } = useDroppable({ id: columnId })
  const status = (columnId in COLUMN_META ? columnId : 'todo') as CardStatus
  const meta = COLUMN_META[status]
  const headingId = `${columnId}-heading`

  const submit = () => {
    const text = newCard.trim()
    if (!text) {
      setInvalid(true)
      return
    }
    onAdd(text)
    setNewCard('')
    setInvalid(false)
  }

  return (
    <section
      ref={setNodeRef}
      aria-labelledby={headingId}
      className={`flex min-w-0 flex-col rounded-col border transition-colors duration-[var(--dur-short)] ease-out md:h-[32rem]
        ${meta.surface} ${isOver ? meta.over : 'border-rule'}`}
    >
      <div className="flex items-center gap-2 px-4 pt-4 pb-3">
        <span aria-hidden="true" className={`size-2 rounded-full ${meta.dot}`} />
        <h2 id={headingId} className={`text-sm font-semibold ${meta.text}`}>
          {meta.label}
        </h2>
        <span className={`ml-auto rounded-full border border-rule bg-paper-3 px-2 py-0.5 font-mono text-xs tabular-nums ${meta.text}`}>
          {items.length}
        </span>
      </div>

      <div className="scroll-hide flex min-h-16 flex-1 flex-col gap-2 px-3 md:overflow-y-auto">
        {items.length === 0 ? (
          <PlaceholderCard id={`${columnId}-placeholder`} active={isOver} activeClass={meta.over} />
        ) : (
          items.map(item => (
            <SortableCard
              key={item.id}
              id={item.id}
              title={item.title}
              status={status}
              onDelete={onDelete ? () => onDelete(item.id) : undefined}
            />
          ))
        )}
      </div>

      <form
        className="px-3 pt-2 pb-3"
        onSubmit={e => {
          e.preventDefault()
          submit()
        }}
      >
        <label htmlFor={`${columnId}-new`} className="sr-only">
          {meta.label}에 카드 추가
        </label>
        <input
          id={`${columnId}-new`}
          className="w-full rounded-lg border border-rule bg-paper-3 px-3 py-2 text-sm text-ink placeholder:text-ink-2
            transition-colors duration-[var(--dur-micro)] ease-out
            hover:border-rule-strong
            focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus
            aria-invalid:border-error
            disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="+ 카드 추가"
          value={newCard}
          aria-invalid={invalid || undefined}
          onChange={e => {
            setNewCard(e.target.value)
            if (invalid) setInvalid(false)
          }}
        />
        {invalid && (
          <p role="alert" className="mt-1 px-1 text-xs text-error">
            내용을 입력하세요
          </p>
        )}
      </form>
    </section>
  )
}

function SortableCard({
  id,
  title,
  status,
  onDelete,
}: {
  id: string
  title: string
  status: CardStatus
  onDelete?: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group touch-none rounded-card cursor-grab active:cursor-grabbing
        focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus
        ${isDragging ? 'opacity-40' : 'opacity-100'}`}
    >
      <BoardCard title={title} status={status} onDelete={onDelete} />
    </div>
  )
}

function PlaceholderCard({ id, active, activeClass }: { id: string; active: boolean; activeClass: string }) {
  const { setNodeRef, transform, transition, attributes, listeners } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex min-h-16 select-none items-center justify-center rounded-card border border-dashed text-xs text-ink-2
        transition-colors duration-[var(--dur-short)] ease-out
        ${active ? activeClass : 'border-rule'}`}
    >
      비어 있음
    </div>
  )
}
