export type PuzzleItem = {
  id: string
  value: string
  type: "number" | "operator"
}

export type Puzzle = {
  id: string
  target: number
  candidates: PuzzleItem[]
}