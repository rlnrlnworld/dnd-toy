# dnd-toy

`@dnd-kit`으로 만든 드래그앤드롭 연습용 토이. Next.js 정적 export로 GitHub Pages에 배포됩니다.

**Live:** https://rlnrlnworld.github.io/dnd-toy/

## 페이지

| 경로 | 내용 |
| --- | --- |
| `/` | 두 게임으로 가는 바로가기 타일 |
| `/board` | 칸반 보드. 할 일 · 진행 중 · 완료 3열. 카드 추가 · 삭제(되돌리기) · 열 내 정렬 · 열 간 이동(드래그 중 실시간 미리보기) |
| `/puzzle` | 사자성어 퍼즐. 뜻을 보고 4글자 중 비어 있는 3칸을 후보 글자로 채움. 드래그 또는 클릭으로 배치 |

상태는 메모리에만 있어 새로고침하면 초기화됩니다.

## 스택

- Next.js 15 (App Router, `output: "export"`) · React 19 · TypeScript
- Tailwind CSS v4 · 디자인 토큰은 `src/app/tokens.css` (OKLCH, 라이트/다크)
- `@dnd-kit/core` · `@dnd-kit/sortable`
- Storybook 9 · Vitest · Jest (스캐폴딩)

## 개발

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # 정적 export → out/
npm run storybook  # http://localhost:6006
```

> `npm run dev`가 떠 있는 동안 `npm run build`를 돌리면 `.next` 캐시가 깨져 dev 서버가 500을 냅니다. 둘 중 하나만 실행하세요.

## 배포

`main`에 push하면 GitHub Actions(`.github/workflows/deploy.yml`)가 빌드 후 GitHub Pages에 올립니다. 리포 이름이 URL 경로가 되므로 `next.config.ts`에 `basePath: "/dnd-toy"`가 설정되어 있습니다 (production 빌드에만 적용).

## 구조

```
src/
  app/
    globals.css        Tailwind 진입점, 토큰을 유틸리티로 노출
    tokens.css         색 · 간격 · 모션 토큰
    board/page.tsx
    puzzle/page.tsx
  components/
    board/             SortableBoard · KanbanColumn · BoardCard
    puzzle/            PuzzleGame · DropSlot · CandidateCard
  data/idioms.ts       사자성어 · 뜻 목록
  hooks/usePuzzle.ts   퍼즐 상태 (생성 · 배치 · 채점)
  utils/generatePuzzle.ts
```

사자성어를 추가하려면 `src/data/idioms.ts`에 `{ word, meaning }`을 넣으면 됩니다. 네 글자여야 합니다.
