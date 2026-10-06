import { PuzzleItem } from "@/types/puzzle"
import { useDraggable } from "@dnd-kit/core"

type CandidateCardProps = {
  item: PuzzleItem
  onPick?: (item: PuzzleItem) => void
  overlay?: boolean
}

export const tileShape = "size-14 rounded-card md:size-16"

export default function CandidateCard({ item, onPick, overlay = false }: CandidateCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: item.id, data: item })

  return (
    <button
      ref={setNodeRef}
      type="button"
      aria-label={`글자 ${item.value}`}
      onClick={() => onPick?.(item)}
      {...attributes}
      {...listeners}
      className={`flex touch-none select-none items-center justify-center border border-rule bg-paper-3 text-2xl font-semibold text-ink
        transition-[transform,box-shadow,border-color,opacity] duration-[var(--dur-micro)] ease-out
        ${tileShape}
        ${overlay
          ? "cursor-grabbing shadow-lift"
          : "cursor-grab shadow-whisper hover:-translate-y-px hover:border-puzzle active:translate-y-0 active:cursor-grabbing"}
        ${isDragging && !overlay ? "opacity-30" : "opacity-100"}
        focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus`}
    >
      {item.value}
    </button>
  )
}
