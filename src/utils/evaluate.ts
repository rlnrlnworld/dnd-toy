import { PuzzleItem } from "@/types/puzzle"

const apply = (a: number, op: string, b: number): number => {
  switch (op) {
    case "+": return a + b
    case "-": return a - b
    case "×": return a * b
    case "÷": return a / b
    default: return NaN
  }
}

/**
 * [숫자, 연산, 숫자, 연산, 숫자] 토큰을 사칙연산 우선순위대로 계산.
 * 형식이 어긋나거나 결과가 유한하지 않으면 null.
 */
export function evaluateTokens(items: PuzzleItem[]): number | null {
  if (items.length % 2 === 0) return null

  const nums: number[] = []
  const ops: string[] = []
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (i % 2 === 0) {
      if (item.type !== "number") return null
      nums.push(Number(item.value))
    } else {
      if (item.type !== "operator") return null
      ops.push(item.value)
    }
  }

  // 1차: × ÷
  const n1: number[] = [nums[0]]
  const o1: string[] = []
  for (let i = 0; i < ops.length; i++) {
    if (ops[i] === "×" || ops[i] === "÷") {
      n1[n1.length - 1] = apply(n1[n1.length - 1], ops[i], nums[i + 1])
    } else {
      o1.push(ops[i])
      n1.push(nums[i + 1])
    }
  }
  // 2차: + −
  let result = n1[0]
  for (let i = 0; i < o1.length; i++) result = apply(result, o1[i], n1[i + 1])

  return Number.isFinite(result) ? result : null
}
