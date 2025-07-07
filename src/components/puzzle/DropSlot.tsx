import { PuzzleItem } from "@/types/puzzle"
import { useDroppable } from "@dnd-kit/core"

type DropSlotProps = {
  index: number
  item: PuzzleItem | null
  onRemove: (index: number) => void
}
export default function DropSlot({ index, item, onRemove }: DropSlotProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${index}`,
    data: { index }
  })

  const isOperatorSlot = index % 2 === 1

  return (
    <div
      ref={setNodeRef}
      className={`border-2 rounded-md flex items-center justify-center relative text-[#f0e6d3]
        ${isOperatorSlot ? 'w-16 h-16' : 'w-16 h-20'}
        ${(isOver || item) ? 'border-[#5e9491] bg-[#5e9491]' : 'border-[#395c5a] bg-[#395c5a]'}`}
    >
      {item ? (
        <>
        <div className="absolute inset-1 rounded-md border"></div>
          <span className="text-2xl font-semibold">{item.value}</span>
          <button
            onClick={() => onRemove(index)}
            className="ml-2 text-[#5e9491] bg-[#f0e6d3] focus:outline-none absolute right-0 top-0 w-4 h-4 rounded-full flex items-center justify-center -translate-y-2 translate-x-2"
            aria-label="Remove item"
          >
            &times;
          </button>
        </>
      ) : (
        <span className="text-white text-center font-mono select-none text-xs">Drop here</span>
      )}
    </div>
  )
}