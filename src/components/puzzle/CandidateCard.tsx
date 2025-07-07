import { PuzzleItem } from "@/types/puzzle"
import { useDraggable } from "@dnd-kit/core"

type CandidateCardProps = {
  item: PuzzleItem
}
export default function CandidateCard({ item }: CandidateCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    data: item
  })

  const isOperator = item.type === "operator"

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`
        relative
        select-none cursor-grab text-center font-semibold text-2xl 
        flex items-center justify-center
        ${isOperator ? 'w-16 h-16' : 'w-16 h-20'}
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        bg-[#5e9491] fon-mono rounded-md shadow-sm
        hover:border hover:border-[#f0e6d3]  hover:bg-[#53817f]
        transition-colors duration-200 text-[#f0e6d3]
      `}
      style={{
        transform: transform
        ? `translate(${transform.x}px, ${transform.y}px)`
        : undefined,
      }}
    >
      <div className="absolute inset-1 border border-[#f0e6d3] rounded-md"></div>
      {item.value}
    </div>
  )
}