export type PuzzleItem = {
  id: string
  value: string
}

export type Puzzle = {
  id: string
  word: string
  meaning: string
  /** 처음부터 채워져 있는 글자의 자리 (0–3) */
  fixedIndex: number
  fixed: PuzzleItem
  candidates: PuzzleItem[]
}

export const WORD_LENGTH = 4
