"use client"

import { Puzzle, PuzzleItem } from "@/types/puzzle"
import { generateRandomPuzzle } from "@/utils/generatePuzzle"
import { useState } from "react"

const toEvalExpression = (items: (PuzzleItem | null)[]) => {
  return items
    .filter((i): i is PuzzleItem => i !== null)
    .map(i => {
      if (i.value === '×') return '*'
      if (i.value === '÷') return '/'
      return i.value
    }).join(' ')
}

export function usePuzzle() {
  const [puzzle, setPuzzle] = useState<Puzzle>(() => generateRandomPuzzle())
  const [dropItems, setDropItems] = useState<(PuzzleItem | null)[]>([null, null, null, null, null])
  const [isCorrect, setIsCorrect] = useState<boolean|null>(null)
  const [checked, setChecked] = useState(false)

  const handleDrop = (index: number, item: PuzzleItem) => {
    setDropItems(prev => {
      if (prev[index]) return prev
      const newItems = [...prev]
      newItems[index] = item
      return newItems
    })
  }

  const removeItem = (idx: number) => {
    setDropItems(prev => {
      const newItems = [...prev]
      newItems[idx] = null
      return newItems
    })
  }

  const checkAnswer = () => {
    if (dropItems.includes(null)) {
      setIsCorrect(false)
      setChecked(true)
      return
    }
    
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
    setPuzzle(generateRandomPuzzle());
    setDropItems([null, null, null, null, null])
    setIsCorrect(null)
    setChecked(false)
  };

  const reset = () => {
    setDropItems([null, null, null, null, null])
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