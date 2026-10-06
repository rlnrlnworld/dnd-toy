"use client"

import { Puzzle, PuzzleItem, SLOT_TYPES } from "@/types/puzzle"
import { evaluateTokens } from "@/utils/evaluate"
import { generateRandomPuzzle } from "@/utils/generatePuzzle"
import { useEffect, useMemo, useState } from "react"

export type PuzzleResult = "idle" | "correct" | "wrong"

const emptySlots = (): (PuzzleItem | null)[] => SLOT_TYPES.map(() => null)

export function usePuzzle() {
  // 랜덤 생성은 클라이언트 마운트 후에만 (SSR hydration 불일치 방지)
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null)
  useEffect(() => setPuzzle(generateRandomPuzzle()), [])
  const [slots, setSlots] = useState<(PuzzleItem | null)[]>(emptySlots)
  const [result, setResult] = useState<PuzzleResult>("idle")
  const [computed, setComputed] = useState<number | null>(null)
  const [solved, setSolved] = useState(0)

  /** 슬롯에 이미 들어간 후보는 후보열에서 제외 */
  const remaining = useMemo(
    () => (puzzle?.candidates ?? []).filter(c => !slots.some(s => s?.id === c.id)),
    [puzzle, slots]
  )

  const isComplete = slots.every(Boolean)

  const canPlace = (index: number, item: PuzzleItem) => SLOT_TYPES[index] === item.type

  const place = (index: number, item: PuzzleItem) => {
    if (!canPlace(index, item)) return false
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

  /** 클릭 배치: 타입이 맞는 첫 빈 슬롯 */
  const placeAuto = (item: PuzzleItem) => {
    const index = slots.findIndex((s, i) => s === null && SLOT_TYPES[i] === item.type)
    if (index === -1) return false
    return place(index, item)
  }

  const remove = (index: number) => {
    setSlots(prev => {
      const next = [...prev]
      next[index] = null
      return next
    })
    setResult("idle")
  }

  const check = () => {
    if (!isComplete || !puzzle) return
    const value = evaluateTokens(slots as PuzzleItem[])
    setComputed(value)
    const correct = value !== null && Math.abs(value - puzzle.target) < 1e-9
    if (correct && result !== "correct") setSolved(n => n + 1)
    setResult(correct ? "correct" : "wrong")
  }

  const reset = () => {
    setSlots(emptySlots())
    setResult("idle")
    setComputed(null)
  }

  const next = () => {
    setPuzzle(generateRandomPuzzle())
    reset()
  }

  return { puzzle, slots, remaining, isComplete, result, computed, solved, canPlace, place, placeAuto, remove, check, reset, next }
}
