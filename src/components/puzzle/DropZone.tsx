import { PuzzleItem } from "@/types/puzzle"
import { useDroppable } from "@dnd-kit/core"

type DropZoneProps = {
  items: PuzzleItem[],
  onRemove: (idx: number) => void
}

export default function DropZone({ items, onRemove }: DropZoneProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'drop-zone'
  })

  return (
    <div
      ref={setNodeRef}
      style={{
        border: '2px dashed #ccc',
        padding: '16px',
        minHeight: '80px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap',
        backgroundColor: isOver ? '#f0f8ff' : '#fafafa',
        borderRadius: '8px',
        transition: 'background-color 0.2s ease',
      }}
    >
      {items.length === 0 && (
        <span className="text-[#aaa]">여기에 수식을 드래그해서 만들어보세요.</span>
      )}
      {items.map((item, idx) => (
        <div 
          key={item.id + '-' + idx}
          style={{
            padding: '12px 16px',
            backgroundColor: item.type === 'number' ? '#fff' : '#f5f5f5',
            border: '1px solid #bbb',
            borderRadius: '6px',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            position: 'relative',
          }}
        >
          {item.value}
          <button
            onClick={() => onRemove(idx)}
            style={{
              position: 'absolute',
              top: '-6px',
              right: '-6px',
              background: '#e00',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              cursor: 'pointer',
              fontSize: '12px',
              lineHeight: '20px',
              textAlign: 'center',
            }}
          >
            X
          </button>
        </div>
      ))}
    </div>
  )
}