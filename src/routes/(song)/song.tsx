import { useSearch } from '@tanstack/solid-router';
import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/(song)/song')({
  component: SongPage,
})

export default function SongPage() {
  const search = useSearch(); // ✅ 自动适配当前页面路径

  return (
    <div>
      <h1>Song Page</h1>
      <p>Keyword: {search.keyword}</p>
    </div>
  );
}
