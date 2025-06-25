export default function BoardCard({ title }: { title: string }) {
  return (
    <div className="p-4 border border-gray-200 dark:border-gray-500 rounded shadow-sm bg-white hover:bg-gray-50 cursor-pointer dark:bg-gray-800/30 dark:hover:bg-gray-900/30">
      { title }
    </div>
  )
}