import Link from "next/link";
import SortableBoard from "@/components/board/SortableBoard";

export default function BoardPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col gap-6 px-4 py-6 md:gap-8 md:px-10 md:py-10">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5">
          <Link
            href="/"
            aria-label="홈으로"
            className="-ml-2 flex size-8 shrink-0 items-center justify-center rounded-md text-ink-2
              transition-colors duration-[var(--dur-micro)] ease-out
              hover:bg-paper-2 hover:text-ink active:translate-y-px
              focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 stroke-current" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 3L5 8l5 5" />
            </svg>
          </Link>
          <h1 className="text-2xl font-semibold tracking-[-0.025em] text-ink md:text-3xl">
            칸반 보드
          </h1>
        </div>
        <p className="hidden text-sm text-ink-2 sm:block">카드를 끌어 열 사이로 옮기세요</p>
      </header>
      <SortableBoard />
    </main>
  );
}
