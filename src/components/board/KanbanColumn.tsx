'use client'

import { useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'
import BoardCard from './BoardCard'
import { useSortable } from '@dnd-kit/sortable'

type CardItem = { id: string; title: string }

export default function KanbanColumn({
  columnId,
  items,
  onAdd,
}: {
  columnId: string
  items: CardItem[]
  onAdd: (text: string) => void
}) {
  const [newCard, setNewCard] = useState('')

  const { setNodeRef, isOver } = useDroppable({ id: columnId })

  return (
    <div
      ref={setNodeRef}
      className={`p-4 rounded-md w-64 min-w-[16rem] transition
        ${isOver ? 'bg-indigo-100' : 'bg-gray-100'}
        ${columnId === "todo" ? "bg-gray-100 dark:bg-gray-100/30" : columnId === "doing" ? "!bg-blue-100/30" : "!bg-green-100/30"}
      `}
    >
      <h2 className={`text-lg w-fit px-2 font-semibold capitalize mb-2 rounded-full ${columnId === "todo" ? "bg-gray-800 text-white" : columnId === "doing" ? "bg-blue-700 text-white" : "bg-green-700 text-white"}`}>{columnId}</h2>

      <div className='flex flex-col h-[30rem] justify-between'>
        <div className="space-y-2 min-h-[4rem] flex-1 overflow-auto scroll-hide">
        {items.length === 0 ? (
          <PlaceholderCard id={`${columnId}-placeholder`} />
        ) : (
          items.map(item => (
            <SortableCard key={item.id} id={item.id} title={item.title} />
          ))
        )}
      </div>

      <input
        className="border px-2 py-1 rounded text-sm w-full mt-3"
        placeholder="카드 추가"
        value={newCard}
        onChange={e => setNewCard(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && newCard.trim()) {
            onAdd(newCard.trim())
            setNewCard('')
          }
        }}
      />
      </div>
    </div>
  )
}


function SortableCard({ id, title }: { id: string; title: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <BoardCard title={title} />
    </div>
  )
}

function PlaceholderCard({ id }: { id: string }) {
  const { setNodeRef, transform, transition, attributes, listeners } =
    useSortable({ id })

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
      className="h-10 border-2 border-dashed rounded opacity-10 flex items-center justify-center text-sm text-gray-500"
    >
      Drop here
    </div>
  )
}