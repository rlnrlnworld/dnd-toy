"use client"

import { usePuzzle } from "@/hooks/usePuzzle";
import { PuzzleItem } from "@/types/puzzle";
import { DragEndEvent, DndContext } from "@dnd-kit/core";
import CandidateCard from "./CandidateCard";
import DropZone from "./DropZone";

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
    if (over?.id === "drop-zone") {
      const item = active.data.current as PuzzleItem
      if (item) handleDrop(item)
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '32px 16px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>
          🎯 정답 숫자: <strong>{puzzle.target}</strong>
        </h2>

        <DropZone items={dropItems} onRemove={removeItem} />

        <div
          style={{
            marginTop: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          {puzzle.candidates.map(item => (
            <CandidateCard key={item.id} item={item} />
          ))}
        </div>

        <div style={{ marginTop: '24px', display: 'flex', gap: '8px' }}>
          <button onClick={checkAnswer}>정답 확인</button>
          <button onClick={reset}>리셋</button>
          <button onClick={nextPuzzle}>다음 문제</button>
        </div>

        {checked && (
          <div style={{ marginTop: '16px', fontWeight: 'bold' }}>
            {isCorrect ? '✅ 정답입니다!' : '❌ 오답입니다'}
          </div>
        )}
      </div>
    </DndContext>
  )
}