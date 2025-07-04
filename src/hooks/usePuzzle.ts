"use client"

import { Puzzle, PuzzleItem } from "@/types/puzzle"
import { generateRandomPuzzle } from "@/utils/generatePuzzle"
import { useState } from "react"

const toEvalExpression = (items: PuzzleItem[]) => {
  return items.map( i => {
    if (i.value === '×') return '*'
    if (i.value === '÷') return '/'
    return i.value
  }).join(' ')
}

export function usePuzzle() {
  const [puzzle, setPuzzle] = useState<Puzzle>(() => generateRandomPuzzle())
  const [dropItems, setDropItems] = useState<PuzzleItem[]>([])
  const [isCorrect, setIsCorrect] = useState<boolean|null>(null)
  const [checked, setChecked] = useState(false)

  const handleDrop = (item: PuzzleItem) => {
    setDropItems(prev => [...prev, item])
    setChecked(false)
    setIsCorrect(null)
  }

  const removeItem = (idx: number) => {
    setDropItems(prev => prev.filter((_, i) => i != idx))
  }

  const checkAnswer = () => {
    const expr = toEvalExpression(dropItems)
    let result: number

    try {
      result = eval(expr)
    } catch (e) {
      setIsCorrect(false)
      setChecked(true)
      return
    }

    const correct = Math.round(result) === puzzle.target
    setIsCorrect(correct)
    setChecked(true)
  }

  const nextPuzzle = () => {
    setPuzzle(generateRandomPuzzle())
    setDropItems([])
    setIsCorrect(null)
    setChecked(false)
  }

  const reset = () => {
    setDropItems([])
    setIsCorrect(null)
    setChecked(false)
  }

  return {
    puzzle,
    dropItems,
    handleDrop,
    removeItem,
    checkAnswer,
    nextPuzzle,
    reset,
    isCorrect,
    checked,
  }
}