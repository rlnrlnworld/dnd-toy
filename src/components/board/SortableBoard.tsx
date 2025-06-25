'use client'

import {
  closestCorners,
  DndContext,
  DragOverlay,
  DragStartEvent,
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
import { useEffect, useState } from 'react'
import KanbanColumn from './KanbanColumn'
import { v4 as uuidv4 } from 'uuid'
import BoardCard from './BoardCard'

type ColumnType = 'todo' | 'doing' | 'done'
type CardItem = { id: string, title: string }
type ColumnState = Record<ColumnType, CardItem[]>

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

export default function SortableBoard() {
  const [columns, setColumns] = useState<ColumnState>(initialData)
  const sensors = useSensors(useSensor(PointerSensor))
  const [activeCard, setActiveCard] = useState<CardItem | null>(null)

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const findCardLocation = (id: string): [ColumnType, number] | null => {
    for (const columnId of Object.keys(columns) as ColumnType[]) {
      const idx = columns[columnId].findIndex(item => item.id === id)
      if (idx !== -1) return [columnId, idx]
    }
    return null
  }

  const handleDragStart = (e: DragStartEvent) => {
    const location = findCardLocation(e.active.id.toString())
    if (!location) return
    const [columnId, idx] = location
    setActiveCard(columns[columnId][idx])
  }

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    setActiveCard(null)

    if (!over || active.id === over.id) return

    const from = findCardLocation(active.id.toString())
    if (!from) return
    const [fromColumn, fromIdx] = from

    const columnIds: ColumnType[] = ['todo', 'doing', 'done']

    const isDroppingOnColumn =
      columnIds.includes(over.id as ColumnType) ||
      columnIds.some(id => over.id === `${id}-placeholder`)

    if (isDroppingOnColumn) {
      const toColumn = (String(over.id).replace('-placeholder', '') as ColumnType)
      const fromItems = [...columns[fromColumn]]
      const toItems = [...columns[toColumn]]
      const [moved] = fromItems.splice(fromIdx, 1)
      toItems.push(moved)

      setColumns({
        ...columns,
        [fromColumn]: fromItems,
        [toColumn]: toItems
      })
      return
    }

    const to = findCardLocation(over.id.toString())
    if (!to) return
    const [toColumn, toIdx] = to

    if (fromColumn === toColumn) {
      const newItems = arrayMove(columns[fromColumn], fromIdx, toIdx)
      setColumns({ ...columns, [fromColumn]: newItems })
    } else {
      const fromItems = [...columns[fromColumn]]
      const toItems = [...columns[toColumn]]
      const [moved] = fromItems.splice(fromIdx, 1)
      toItems.splice(toIdx, 0, moved)

      setColumns({
        ...columns,
        [fromColumn]: fromItems,
        [toColumn]: toItems
      })
    }
  }
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <DragOverlay>
        {activeCard ? <BoardCard title={activeCard.title} /> : null}
      </DragOverlay>
      <div className="flex gap-4 overflow-auto">
        {(Object.entries(columns) as [ColumnType, CardItem[]][]).map(([columnId, items]) => (
          <SortableContext
            key={columnId}
            items={
              items.length > 0
                ? items.map(item => item.id)
                : [`${columnId}-placeholder`]
            }
            strategy={verticalListSortingStrategy}
          >
            <KanbanColumn
              columnId={columnId}
              items={items}
              onAdd={(text) => {
                const newItem: CardItem = {
                  id: uuidv4(),
                  title: text
                }
                setColumns({
                  ...columns,
                  [columnId]: [...columns[columnId], newItem]
                })
              }}
            />
          </SortableContext>
        ))}
      </div>
    </DndContext>
  )
}