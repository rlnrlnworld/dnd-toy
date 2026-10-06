"use client"

import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import Link from "next/link"
import { useState } from "react"
import { usePuzzle } from "@/hooks/usePuzzle"
import { PuzzleItem } from "@/types/puzzle"
import CandidateCard from "./CandidateCard"
import DropSlot from "./DropSlot"

const btnBase = `rounded-lg px-4 py-2 text-sm font-semibold transition-[background-color,color,border-color,transform,opacity] duration-[var(--dur-micro)] ease-out
  active:translate-y-px focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus
  disabled:cursor-not-allowed disabled:opacity-50 disabled:active:translate-y-0`
const btnPrimary = `${btnBase} border border-puzzle-ink bg-puzzle-ink text-paper hover:bg-puzzle`
const btnSecondary = `${btnBase} border border-rule bg-paper-3 text-ink hover:border-rule-strong`
const btnGhost = `${btnBase} text-ink-2 hover:bg-paper-2 hover:text-ink`

export default function PuzzleGame() {
  const { puzzle, slots, remaining, isComplete, isEmptyExceptFixed, isFixed, result, solved, revealed, place, placeAuto, remove, check, reset, reveal, next } = usePuzzle()
  const [active, setActive] = useState<PuzzleItem | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

  if (!puzzle) return <main className="min-h-dvh" aria-busy="true" />

  const locked = result === "correct" || revealed

  const handleDragStart = (e: DragStartEvent) => setActive(e.active.data.current as PuzzleItem)
  const handleDragEnd = (e: DragEndEvent) => {
    setActive(null)
    const item = e.active.data.current as PuzzleItem | undefined
    const index = e.over?.data.current?.index
    if (item && typeof index === "number") place(index, item)
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={() => setActive(null)}>
      <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col gap-8 px-4 py-6 md:px-10 md:py-10">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <Link
              href="/"
              aria-label="홈으로"
              className="-ml-2 flex size-8 shrink-0 items-center justify-center rounded-md text-ink-2
                transition-colors duration-[var(--dur-micro)] ease-out
                hover:bg-paper-2 hover:text-ink active:translate-y-px
                focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 stroke-current" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 3L5 8l5 5" />
              </svg>
            </Link>
            <h1 className="text-2xl font-semibold tracking-[-0.025em] text-ink md:text-3xl">사자성어 퍼즐</h1>
          </div>
          <p className="font-mono text-sm tabular-nums text-ink-2">
            맞힌 문제 <span className="text-ink">{solved}</span>
          </p>
        </header>

        <section aria-label="문제" className="flex flex-col gap-6 rounded-col bg-puzzle-soft px-4 py-6 md:px-8 md:py-8">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-puzzle-ink">뜻</p>
            <p className="text-base leading-relaxed text-ink md:text-lg">{puzzle.meaning}</p>
          </div>

          <div className="flex items-center justify-center gap-2 md:gap-3">
            {slots.map((item, index) => (
              <DropSlot
                key={index}
                index={index}
                item={item}
                fixed={isFixed(index)}
                dragging={active !== null}
                locked={locked}
                result={result}
                onRemove={remove}
              />
            ))}
          </div>

          <p role="status" aria-live="polite" className="min-h-5 text-center text-sm">
            {result === "correct" && <span className="font-semibold text-success">정답</span>}
            {result === "wrong" && <span className="text-error">틀렸어요 · 다시 시도</span>}
            {revealed && result === "idle" && <span className="text-puzzle-ink">정답은 「{puzzle.word}」</span>}
            {!revealed && result === "idle" && !isComplete && <span className="text-ink-2">글자를 끌어오거나 눌러서 채우세요</span>}
          </p>
        </section>

        <section aria-label="후보 글자" className="flex min-h-16 flex-col items-center">
          {remaining.length > 0 ? (
            <div className="grid grid-cols-4 gap-2 md:gap-3">
              {remaining.map(item => (
                <CandidateCard key={item.id} item={item} onPick={locked ? undefined : placeAuto} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-2">후보를 모두 사용했어요</p>
          )}
        </section>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <button type="button" onClick={check} disabled={!isComplete || locked} className={btnPrimary}>
            정답 확인
          </button>
          <button type="button" onClick={reset} disabled={isEmptyExceptFixed && !revealed} className={btnGhost}>
            리셋
          </button>
          <button type="button" onClick={reveal} disabled={locked} className={btnGhost}>
            정답 보기
          </button>
          <button type="button" onClick={next} className={btnSecondary}>
            다음 문제
          </button>
        </div>
      </main>

      <DragOverlay dropAnimation={{ duration: 180, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }}>
        {active ? <CandidateCard item={active} overlay /> : null}
      </DragOverlay>
    </DndContext>
  )
}
