import { PuzzleItem } from "@/types/puzzle"
import { useDroppable } from "@dnd-kit/core"

type DropSlotProps = {
  index: number
  item: PuzzleItem | null
  onDrop: (index: number, item: PuzzleItem) => void
  onRemove: (index: number) => void
}
export default function DropSlot({ index, item, onDrop, onRemove }:DropSlotProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${index}`,
    data: { index }
  })

  const isOperatorSlot = index % 2 === 1

  return (
    <div
      ref={setNodeRef}
      style={{
        width: 60,
        height: 80,
        border: '2px dashed #ccc',
        borderRadius: '8px',
        backgroundColor: isOver ? '#eef' : '#f9f9f9',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: isOperatorSlot ? '#555' : '#000',
      }}
    >
      {item ? (
        <div>
          {item.value}
          <button
            onClick={() => onRemove(index)}
            style={{
              position: 'absolute',
              top: -6,
              right: -6,
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: 'red',
              color: '#fff',
              fontSize: 10,
              border: 'none',
            }}
          >
            ×
          </button>
        </div>
      ) : (
        <span style={{ opacity: 0.3 }}>
          {isOperatorSlot ? '+' : '7'}
        </span>
      )}
    </div>
  )
}