import { PuzzleItem } from "@/types/puzzle"
import { PuzzleResult } from "@/hooks/usePuzzle"
import { useDroppable } from "@dnd-kit/core"
import { tileShape } from "./CandidateCard"

type DropSlotProps = {
  index: number
  item: PuzzleItem | null
  fixed: boolean
  dragging: boolean
  locked: boolean
  result: PuzzleResult
  onRemove: (index: number) => void
}

export default function DropSlot({ index, item, fixed, dragging, locked, result, onRemove }: DropSlotProps) {
  const { setNodeRef, isOver } = useDroppable({ id: `slot-${index}`, data: { index }, disabled: fixed || locked })

  const border =
    result === "correct" ? "border-success"
    : result === "wrong" && !fixed ? "border-error"
    : fixed ? "border-puzzle"
    : isOver ? "border-puzzle bg-puzzle/20"
    : dragging ? "border-puzzle/60"
    : "border-rule"

  const surface = fixed
    ? "bg-puzzle-soft text-puzzle-ink"
    : item ? "bg-paper-3 text-ink" : "bg-paper/60 text-ink-2"

  return (
    <div
      ref={setNodeRef}
      aria-label={fixed ? `${index + 1}번째 글자 ${item?.value} (고정)` : `${index + 1}번째 글자 자리`}
      className={`relative flex items-center justify-center border-2 text-2xl font-semibold md:text-3xl
        transition-[border-color,background-color] duration-[var(--dur-short)] ease-out
        ${tileShape} ${surface} ${border}`}
    >
      {item ? (
        <>
          <span>{item.value}</span>
          {!fixed && !locked && (
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
          )}
        </>
      ) : (
        <span aria-hidden="true" className="size-1.5 rounded-full bg-rule-strong" />
      )}
    </div>
  )
}
