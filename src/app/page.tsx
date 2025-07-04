"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()
  return (
    <div className="h-screen w-full flex items-center justify-center font-[family-name:var(--font-geist-sans)]">
      <main className="grid grid-cols-2 gap-2">
        <div onClick={() => router.push("/board")} className="w-40 h-50 rounded-md bg-black dark:border dark:border-white px-6 py-6 flex flex-col justify-between group dark:hover:bg-white/20 hover:!cursor-pointer">
          {/* 칸반 보드 */}
          <div className="w-20 h-20 rounded-full bg-[#fdc453] dark:bg-[#f6b229] group-hover:bg-[#f8ab10]"></div>
          <h1 className="text-[#f6b229] group-hover:text-[#f8ab10] font-bold text-3xl">Kanban</h1>
        </div>
      </main>
    </div>
  );
}
