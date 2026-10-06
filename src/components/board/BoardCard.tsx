export type CardStatus = 'todo' | 'doing' | 'done'

type BoardCardProps = {
  title: string
  status?: CardStatus
  overlay?: boolean
  onDelete?: () => void
}

export default function BoardCard({ title, status = 'todo', overlay = false, onDelete }: BoardCardProps) {
  const isDone = status === 'done'

  return (
    <div
      className={`flex items-start gap-2 rounded-card border bg-paper-3 py-2.5 pr-1.5 pl-3 text-sm leading-snug
        transition-[transform,box-shadow,border-color] duration-[var(--dur-micro)] ease-out
        ${isDone ? 'text-ink-2 line-through decoration-rule-strong' : 'text-ink'}
        ${overlay
          ? 'cursor-grabbing border-rule-strong shadow-lift'
          : 'border-rule shadow-whisper group-hover:-translate-y-px group-hover:border-rule-strong'
        }`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 10 16"
        className={`mt-[3px] size-3.5 shrink-0 fill-ink-2 transition-opacity duration-[var(--dur-micro)] ease-out
          ${overlay ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'}`}
      >
        <circle cx="3" cy="3" r="1.4" />
        <circle cx="7" cy="3" r="1.4" />
        <circle cx="3" cy="8" r="1.4" />
        <circle cx="7" cy="8" r="1.4" />
        <circle cx="3" cy="13" r="1.4" />
        <circle cx="7" cy="13" r="1.4" />
      </svg>
      <span className="min-w-0 flex-1 break-words py-0.5">{title}</span>
      {onDelete && !overlay && (
        <button
          type="button"
          aria-label={`${title} 삭제`}
          onPointerDown={e => e.stopPropagation()}
          onClick={e => {
            e.stopPropagation()
            onDelete()
          }}
          className="-my-1 flex size-6 shrink-0 items-center justify-center rounded-md text-ink-2 opacity-0
            transition-[opacity,background-color,color] duration-[var(--dur-micro)] ease-out
            group-hover:opacity-100 group-focus-within:opacity-100
            hover:bg-paper-2 hover:text-ink active:translate-y-px
            focus:outline-none focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus"
        >
          <svg aria-hidden="true" viewBox="0 0 12 12" className="size-3 stroke-current" strokeWidth="1.5" strokeLinecap="round">
            <path d="M3 3l6 6M9 3l-6 6" />
          </svg>
        </button>
      )}
    </div>
  )
}
