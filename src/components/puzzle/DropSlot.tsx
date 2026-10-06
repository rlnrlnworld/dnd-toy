import { PuzzleItem, PuzzleItemType, SLOT_TYPES } from "@/types/puzzle"
import { PuzzleResult } from "@/hooks/usePuzzle"
import { useDroppable } from "@dnd-kit/core"
import { candidateShape } from "./CandidateCard"

type DropSlotProps = {
  index: number
  item: PuzzleItem | null
  draggingType: PuzzleItemType | null
  result: PuzzleResult
  onRemove: (index: number) => void
}

export default function DropSlot({ index, item, draggingType, result, onRemove }: DropSlotProps) {
  const type = SLOT_TYPES[index]
  const { setNodeRef, isOver } = useDroppable({ id: `slot-${index}`, data: { index } })

  const accepts = draggingType !== null && draggingType === type
  const rejecting = draggingType !== null && draggingType !== type

  const border =
    result === "correct" ? "border-success"
    : result === "wrong" ? "border-error"
    : isOver && accepts ? "border-puzzle bg-puzzle/20"
    : accepts ? "border-puzzle/60"
    : "border-rule"

  return (
    <div
      ref={setNodeRef}
      aria-label={`${index + 1}번째 ${type === "operator" ? "연산" : "숫자"} 자리`}
      className={`relative flex items-center justify-center border-2 font-mono text-2xl font-semibold tabular-nums
        transition-[border-color,background-color,opacity] duration-[var(--dur-short)] ease-out
        ${candidateShape(type)}
        ${item ? "bg-paper-3 text-ink" : `bg-paper/60 text-ink-2 ${rejecting ? "opacity-40" : ""}`}
        ${border}`}
    >
      {item ? (
        <>
          <span>{item.value}</span>
          <button
            type="button"
            aria-label={`${item.value} 빼기`}
            onClick={() => onRemove(index)}
            className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full border border-rule bg-paper-3 text-ink-2
              transition-colors duration-[var(--dur-micro)] ease-out
              hover:bg-paper-2 hover:text-ink active:translate-y-px
              focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus"
          >
            <svg aria-hidden="true" viewBox="0 0 12 12" className="size-2.5 stroke-current" strokeWidth="1.75" strokeLinecap="round">
              <path d="M3 3l6 6M9 3l-6 6" />
            </svg>
          </button>
        </>
      ) : (
        <span aria-hidden="true" className="text-xs font-sans font-normal">
          {type === "operator" ? "연산" : "숫자"}
        </span>
      )}
    </div>
  )
}
