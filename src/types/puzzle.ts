export type PuzzleItemType = "number" | "operator"

export type PuzzleItem = {
  id: string
  value: string
  type: PuzzleItemType
}

export type Puzzle = {
  id: string
  target: number
  candidates: PuzzleItem[]
}

/** 슬롯 순서: 숫자 · 연산 · 숫자 · 연산 · 숫자 */
export const SLOT_TYPES: readonly PuzzleItemType[] = ["number", "operator", "number", "operator", "number"]
