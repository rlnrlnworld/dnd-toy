'use client';
'use client';

import type { PuzzleItem } from '@/types/puzzle';

import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { usePuzzle } from '@/hooks/usePuzzle';
import DropSlot from './DropSlot';
import CandidateCard from './CandidateCard';

export default function PuzzleGame() {
  const {
    puzzle,
    dropItems,
    handleDrop,
    removeItem,
    checkAnswer,
    nextPuzzle,
    reset,
    isCorrect,
    checked,
  } = usePuzzle()

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    const item = active.data.current as PuzzleItem
    const slotIndex = over?.data?.current?.index

    if (item && typeof slotIndex === 'number') {
      handleDrop(slotIndex, item)
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="max-w-2xl mx-auto py-10 px-4 flex flex-col gap-6">
        <h2 className="text-5xl font-bold text-center">
          🎯 <span className="text-[#53817f] dark:text-[#f7f0e3]">{puzzle.target}</span>
        </h2>

        <div className="flex justify-around items-center bg-[#53817f6c] rounded-md p-3">
          {dropItems.map((item, index) => (
            <DropSlot
              key={index}
              index={index}
              item={item}
              onRemove={removeItem}
            />
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3 items-center p-3 rounded-md bg-[#f7f0e3]">
          {puzzle.candidates.map((item) => (
            <CandidateCard key={item.id} item={item} />
          ))}
        </div>

        <div className="flex justify-center gap-3 mt-4">
          <button
            onClick={checkAnswer}
            className="bg-[#53817f] text-[#f7f0e3] px-4 py-2 rounded hover:bg-[#416563] transition"
          >
            정답 확인
          </button>
          <button
            onClick={reset}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition text-gray-400"
          >
            리셋
          </button>
          <button
            onClick={nextPuzzle}
            className="bg-[#53817f] text-[#f7f0e3] px-4 py-2 rounded hover:bg-[#416563] transition"
          >
            다음 문제
          </button>
        </div>

        {checked && (
          <div
            className={`text-center font-bold text-xl mt-4 ${
              isCorrect ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isCorrect ? '✅ 정답입니다!' : '❌ 오답입니다.'}
          </div>
        )}
      </div>
    </DndContext>
  )
}
