import { PuzzleItem } from "@/types/puzzle"
import { useDraggable } from "@dnd-kit/core"

type CandidateCardProps = {
  item: PuzzleItem
}
export default function CandidateCard({ item }: CandidateCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    data: {
      ...item
    }
  })

  const style: React.CSSProperties = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
    userSelect: 'none',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '2px solid #ccc',
    backgroundColor: item.type === 'number' ? '#fff' : '#f5f5f5',
    fontWeight: 'bold',
    fontSize: '1.2rem',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  }

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={style}>
      {item.value}
    </div>
  )
}