"use client"

import { Puzzle, PuzzleItem, WORD_LENGTH } from "@/types/puzzle"
import { generateRandomPuzzle } from "@/utils/generatePuzzle"
import { useEffect, useMemo, useState } from "react"

export type PuzzleResult = "idle" | "correct" | "wrong"

const slotsFor = (puzzle: Puzzle): (PuzzleItem | null)[] =>
  Array.from({ length: WORD_LENGTH }, (_, i) => (i === puzzle.fixedIndex ? puzzle.fixed : null))

export function usePuzzle() {
  // 랜덤 생성은 클라이언트 마운트 후에만 (SSR hydration 불일치 방지)
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null)
  const [slots, setSlots] = useState<(PuzzleItem | null)[]>([])
  const [result, setResult] = useState<PuzzleResult>("idle")
  const [solved, setSolved] = useState(0)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const p = generateRandomPuzzle()
    setPuzzle(p)
    setSlots(slotsFor(p))
  }, [])

  /** 슬롯에 들어간 후보는 후보열에서 제외 */
  const remaining = useMemo(
    () => (puzzle?.candidates ?? []).filter(c => !slots.some(s => s?.id === c.id)),
    [puzzle, slots]
  )

  const isComplete = slots.length === WORD_LENGTH && slots.every(Boolean)
  const isFixed = (index: number) => puzzle?.fixedIndex === index
  const isEmptyExceptFixed = slots.every((s, i) => isFixed(i) || s === null)

  const place = (index: number, item: PuzzleItem) => {
    if (!puzzle || isFixed(index) || result === "correct") return false
    setSlots(prev => {
      const next = [...prev]
      const already = next.findIndex(s => s?.id === item.id)
      if (already !== -1) next[already] = null
      next[index] = item
      return next
    })
    setResult("idle")
    return true
  }

  /** 클릭 배치: 고정 칸을 제외한 첫 빈 칸 */
  const placeAuto = (item: PuzzleItem) => {
    const index = slots.findIndex((s, i) => s === null && !isFixed(i))
    if (index === -1) return false
    return place(index, item)
  }

  const remove = (index: number) => {
    if (isFixed(index) || result === "correct") return
    setSlots(prev => {
      const next = [...prev]
      next[index] = null
      return next
    })
    setResult("idle")
  }

  const check = () => {
    if (!isComplete || !puzzle) return
    const answer = slots.map(s => s!.value).join("")
    const correct = answer === puzzle.word
    if (correct && result !== "correct") setSolved(n => n + 1)
    setResult(correct ? "correct" : "wrong")
  }

  const reset = () => {
    if (puzzle) setSlots(slotsFor(puzzle))
    setResult("idle")
    setRevealed(false)
  }

  /** 정답 공개: 후보에 있는 글자는 후보 아이템을 그대로 써서 후보열에서 빠지게 함 */
  const reveal = () => {
    if (!puzzle) return
    const used = new Set<string>()
    setSlots(puzzle.word.split("").map((ch, i) => {
      if (i === puzzle.fixedIndex) return puzzle.fixed
      const c = puzzle.candidates.find(c => c.value === ch && !used.has(c.id))
      if (c) {
        used.add(c.id)
        return c
      }
      return { id: `reveal-${i}`, value: ch }
    }))
    setRevealed(true)
    setResult("idle")
  }

  const next = () => {
    const p = generateRandomPuzzle(puzzle?.word)
    setPuzzle(p)
    setSlots(slotsFor(p))
    setResult("idle")
    setRevealed(false)
  }

  return { puzzle, slots, remaining, isComplete, isEmptyExceptFixed, isFixed, result, solved, revealed, place, placeAuto, remove, check, reset, reveal, next }
}
