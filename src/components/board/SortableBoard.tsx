'use client'

import {
  closestCorners,
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { useEffect, useRef, useState } from 'react'
import KanbanColumn from './KanbanColumn'
import { v4 as uuidv4 } from 'uuid'
import BoardCard, { CardStatus } from './BoardCard'

type ColumnType = CardStatus
type CardItem = { id: string, title: string }
type ColumnState = Record<ColumnType, CardItem[]>
type Deleted = { column: ColumnType; index: number; item: CardItem }

const COLUMN_IDS: ColumnType[] = ['todo', 'doing', 'done']
const UNDO_MS = 6000

const initialData: ColumnState = {
  todo: [
    { id: 'todo-1', title: '할일 1' },
    { id: 'todo-2', title: '할일 2' }
  ],
  doing: [
    { id: 'doing-1', title: '진행 중 1' }
  ],
  done: [
    { id: 'done-1', title: '완료 1' }
  ]
}

const findCardLocation = (state: ColumnState, id: string): [ColumnType, number] | null => {
  for (const columnId of COLUMN_IDS) {
    const idx = state[columnId].findIndex(item => item.id === id)
    if (idx !== -1) return [columnId, idx]
  }
  return null
}

/** over.id가 열 자체, 열 placeholder, 또는 카드 → 소속 열 반환 */
const resolveColumn = (state: ColumnState, overId: string): ColumnType | null => {
  const asColumn = overId.replace('-placeholder', '') as ColumnType
  if (COLUMN_IDS.includes(asColumn)) return asColumn
  return findCardLocation(state, overId)?.[0] ?? null
}

export default function SortableBoard() {
  const [columns, setColumns] = useState<ColumnState>(initialData)
  const [activeCard, setActiveCard] = useState<(CardItem & { status: ColumnType }) | null>(null)
  const [deleted, setDeleted] = useState<Deleted | null>(null)
  const dragSnapshot = useRef<ColumnState | null>(null)
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  )

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  useEffect(() => () => { if (undoTimer.current) clearTimeout(undoTimer.current) }, [])
  if (!mounted) return null

  const handleDragStart = (e: DragStartEvent) => {
    const location = findCardLocation(columns, String(e.active.id))
    if (!location) return
    const [columnId, idx] = location
    dragSnapshot.current = columns
    setActiveCard({ ...columns[columnId][idx], status: columnId })
  }

  // 다른 열 위로 끌면 즉시 그 열에 끼워 넣어 미리보기
  const handleDragOver = (e: DragOverEvent) => {
    const { active, over } = e
    if (!over) return
    const activeId = String(active.id)
    const overId = String(over.id)

    setColumns(prev => {
      const from = findCardLocation(prev, activeId)
      const toColumn = resolveColumn(prev, overId)
      if (!from || !toColumn || from[0] === toColumn) return prev

      const [fromColumn, fromIdx] = from
      const fromItems = [...prev[fromColumn]]
      const toItems = [...prev[toColumn]]
      const [moved] = fromItems.splice(fromIdx, 1)
      const overIdx = toItems.findIndex(item => item.id === overId)
      toItems.splice(overIdx === -1 ? toItems.length : overIdx, 0, moved)

      return { ...prev, [fromColumn]: fromItems, [toColumn]: toItems }
    })
  }

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    setActiveCard(null)
    dragSnapshot.current = null
    if (!over || active.id === over.id) return

    setColumns(prev => {
      const from = findCardLocation(prev, String(active.id))
      const to = findCardLocation(prev, String(over.id))
      if (!from || !to || from[0] !== to[0]) return prev
      const [column, fromIdx] = from
      return { ...prev, [column]: arrayMove(prev[column], fromIdx, to[1]) }
    })
  }

  const handleDragCancel = () => {
    if (dragSnapshot.current) setColumns(dragSnapshot.current)
    dragSnapshot.current = null
    setActiveCard(null)
  }

  const handleAdd = (columnId: ColumnType, text: string) => {
    setColumns(prev => ({
      ...prev,
      [columnId]: [...prev[columnId], { id: uuidv4(), title: text }]
    }))
  }

  const handleDelete = (columnId: ColumnType, id: string) => {
    const index = columns[columnId].findIndex(item => item.id === id)
    if (index === -1) return
    const item = columns[columnId][index]
    setColumns(prev => ({ ...prev, [columnId]: prev[columnId].filter(i => i.id !== id) }))
    setDeleted({ column: columnId, index, item })
    if (undoTimer.current) clearTimeout(undoTimer.current)
    undoTimer.current = setTimeout(() => setDeleted(null), UNDO_MS)
  }

  const handleUndo = () => {
    if (!deleted) return
    const { column, index, item } = deleted
    setColumns(prev => {
      const items = [...prev[column]]
      items.splice(Math.min(index, items.length), 0, item)
      return { ...prev, [column]: items }
    })
    setDeleted(null)
    if (undoTimer.current) clearTimeout(undoTimer.current)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <DragOverlay>
        {activeCard ? <BoardCard title={activeCard.title} status={activeCard.status} overlay /> : null}
      </DragOverlay>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
        {COLUMN_IDS.map(columnId => {
          const items = columns[columnId]
          return (
            <SortableContext
              key={columnId}
              items={items.length > 0 ? items.map(item => item.id) : [`${columnId}-placeholder`]}
              strategy={verticalListSortingStrategy}
            >
              <KanbanColumn
                columnId={columnId}
                items={items}
                onAdd={text => handleAdd(columnId, text)}
                onDelete={id => handleDelete(columnId, id)}
              />
            </SortableContext>
          )
        })}
      </div>

      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-[var(--z-toast)] flex justify-center px-4"
      >
        {deleted && (
          <div className="pointer-events-auto flex items-center gap-3 rounded-card border border-rule bg-paper-3 py-2 pr-2 pl-4 text-sm text-ink shadow-lift">
            <span className="max-w-[16rem] truncate">
              <span className="text-ink-2">삭제됨 · </span>
              {deleted.item.title}
            </span>
            <button
              type="button"
              onClick={handleUndo}
              className="rounded-md px-2.5 py-1 text-sm font-semibold text-ink transition-colors duration-[var(--dur-micro)] ease-out
                hover:bg-paper-2 active:translate-y-px
                focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus"
            >
              되돌리기
            </button>
          </div>
        )}
      </div>
    </DndContext>
  )
}
