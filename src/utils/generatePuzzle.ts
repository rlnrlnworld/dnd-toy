import { Puzzle, PuzzleItem } from "@/types/puzzle"
import { evaluateTokens } from "@/utils/evaluate"
import { v4 as uuid } from 'uuid'

const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min
const pick = <T,>(arr: readonly T[]): T => arr[randomInt(0, arr.length - 1)]

const OPERATORS = ['+', '-', '×', '÷'] as const
const NUM_COUNT = 3
const DISTRACTOR_COUNT = 5

const numberItem = (value: number): PuzzleItem => ({ id: uuid(), value: String(value), type: "number" })
const operatorItem = (value: string): PuzzleItem => ({ id: uuid(), value, type: "operator" })

export function generateRandomPuzzle(): Puzzle {
  const numbers = Array.from({ length: NUM_COUNT }, () => numberItem(randomInt(1, 20)))
  const ops = Array.from({ length: NUM_COUNT - 1 }, () => operatorItem(pick(OPERATORS)))

  const tokens: PuzzleItem[] = []
  numbers.forEach((n, i) => {
    tokens.push(n)
    if (i < ops.length) tokens.push(ops[i])
  })

  const result = evaluateTokens(tokens)
  if (result === null || !Number.isInteger(result)) return generateRandomPuzzle()

  const distractors: PuzzleItem[] = []
  while (distractors.length < DISTRACTOR_COUNT) {
    if (Math.random() < 0.6) {
      const value = String(randomInt(1, 20))
      const taken = [...numbers, ...distractors].some(d => d.type === "number" && d.value === value)
      if (!taken) distractors.push(numberItem(Number(value)))
    } else {
      const value = pick(OPERATORS)
      const taken = [...ops, ...distractors].some(d => d.type === "operator" && d.value === value)
      if (!taken) distractors.push(operatorItem(value))
    }
  }

  const candidates = [...numbers, ...ops, ...distractors].sort(() => Math.random() - 0.5)

  return { id: uuid(), target: result, candidates }
}
