import { PuzzleItem } from "@/types/puzzle"
import { useDroppable } from "@dnd-kit/core"
import DropSlot from "./DropSlot"

type DropZoneProps = {
  items: (PuzzleItem | null)[],
  onRemove: (idx: number) => void,
  onDrop: (idx: number, item: PuzzleItem) => void
}

export default function DropZone({ items, onRemove, onDrop }: DropZoneProps) {
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
      <div className="flex gap-4">
        {items.map((item, index) => (
          <DropSlot
            key={index}
            index={index}
            item={item}
            onDrop={onDrop}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  )
}