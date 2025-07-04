import { Puzzle, PuzzleItem } from "@/types/puzzle"
import { v4 as uuid } from 'uuid'

const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min

const operators = ['+', '-', '×', '÷']

const transformExpression = (expr: string) => expr.replace(/×/g, '*').replace(/÷/g, '/')

export function generateRandomPuzzle(): Puzzle {
  const numCount = randomInt(2, 4)
  const numbers: PuzzleItem[] = []

  for (let i = 0; i < numCount; i++) {
    const value = String(randomInt(1,20))
    numbers.push({
      id: uuid(),
      value,
      type: "number"
    })
  }

  const ops: PuzzleItem[] = []
  for (let i = 0; i < numCount-1; i++) {
    let op = operators[randomInt(0, operators.length - 1)]

    ops.push({
      id: uuid(),
      value: op,
      type: "operator"
    })
  }

  let expression = ''
  for (let i = 0; i< numbers.length; i++) {
    expression += numbers[i].value
    if (i < ops.length) {
      expression += `${ops[i].value}`
    }
  }

  const evalExpression = transformExpression(expression)

  let result: number
  try {
    const evalResult = eval(evalExpression)
    if (!Number.isFinite(evalResult) || !Number.isInteger(evalResult)) {
      return generateRandomPuzzle()
    }
    result = evalResult
  } catch (e) {
    return generateRandomPuzzle()
  }

  const candidates = [...numbers, ...ops].sort(() => Math.random() - 0.5)

  return {
    id: uuid(),
    target: result,
    candidates
  }
}