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
  const { puzzle, slots, remaining, isComplete, result, computed, solved, place, placeAuto, remove, check, reset, next } = usePuzzle()
  const [active, setActive] = useState<PuzzleItem | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

  if (!puzzle) return <main className="min-h-dvh" aria-busy="true" />

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
            <h1 className="text-2xl font-semibold tracking-[-0.025em] text-ink md:text-3xl">수식 퍼즐</h1>
          </div>
          <p className="font-mono text-sm tabular-nums text-ink-2">
            맞힌 문제 <span className="text-ink">{solved}</span>
          </p>
        </header>

        <section aria-label="수식 자리" className="flex flex-col gap-3 rounded-col bg-puzzle-soft px-4 py-6 md:px-6 md:py-8">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            {slots.map((item, index) => (
              <DropSlot
                key={index}
                index={index}
                item={item}
                draggingType={active?.type ?? null}
                result={result}
                onRemove={remove}
              />
            ))}
            <span aria-hidden="true" className="ml-1 font-mono text-3xl text-ink-2">=</span>
            <span aria-label={`목표 수 ${puzzle.target}`} className="font-mono text-4xl font-semibold tabular-nums tracking-[-0.03em] text-puzzle-ink md:text-5xl">
              {puzzle.target}
            </span>
          </div>
          <p role="status" aria-live="polite" className="min-h-5 text-center text-sm">
            {result === "correct" && <span className="font-semibold text-success">정답</span>}
            {result === "wrong" && (
              <span className="text-error">
                {computed === null ? "계산할 수 없는 식" : `계산 결과 ${Number.isInteger(computed) ? computed : computed.toFixed(2)}`} · 다시 시도
              </span>
            )}
            {result === "idle" && !isComplete && <span className="text-ink-2">후보를 끌어오거나 눌러서 채우세요</span>}
          </p>
        </section>

        <section aria-label="후보" className="flex min-h-20 flex-wrap items-center justify-center gap-2 md:gap-3">
          {remaining.map(item => (
            <CandidateCard key={item.id} item={item} onPick={placeAuto} />
          ))}
          {remaining.length === 0 && <p className="text-sm text-ink-2">후보를 모두 사용했어요</p>}
        </section>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <button type="button" onClick={check} disabled={!isComplete || result === "correct"} className={btnPrimary}>
            정답 확인
          </button>
          <button type="button" onClick={reset} disabled={slots.every(s => s === null)} className={btnGhost}>
            리셋
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
