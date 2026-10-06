import Link from "next/link";
import SortableBoard from "@/components/board/SortableBoard";

export default function BoardPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col gap-6 px-4 py-6 md:gap-8 md:px-10 md:py-10">
      <header className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Link
            href="/"
            className="w-fit rounded-sm text-sm text-ink-2 transition-colors duration-[var(--dur-micro)] ease-out hover:text-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            ← 홈
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
