import { IDIOMS } from "@/data/idioms"
import { Puzzle, PuzzleItem, WORD_LENGTH } from "@/types/puzzle"
import { v4 as uuid } from 'uuid'

const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min
const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5)

const DISTRACTOR_COUNT = 5

const charItem = (value: string): PuzzleItem => ({ id: uuid(), value })

/** 정답 글자를 제외한 다른 사자성어 글자 풀 */
const distractorPool = (word: string): string[] => {
  const banned = new Set(word.split(""))
  const pool = new Set<string>()
  for (const { word: w } of IDIOMS) for (const ch of w) if (!banned.has(ch)) pool.add(ch)
  return [...pool]
}

export function generateRandomPuzzle(exclude?: string): Puzzle {
  const choices = exclude ? IDIOMS.filter(i => i.word !== exclude) : IDIOMS
  const { word, meaning } = choices[randomInt(0, choices.length - 1)]
  const chars = word.split("")
  const fixedIndex = randomInt(0, WORD_LENGTH - 1)

  const fixed = charItem(chars[fixedIndex])
  const answers = chars.filter((_, i) => i !== fixedIndex).map(charItem)
  const distractors = shuffle(distractorPool(word)).slice(0, DISTRACTOR_COUNT).map(charItem)

  return {
    id: uuid(),
    word,
    meaning,
    fixedIndex,
    fixed,
    candidates: shuffle([...answers, ...distractors]),
  }
}
