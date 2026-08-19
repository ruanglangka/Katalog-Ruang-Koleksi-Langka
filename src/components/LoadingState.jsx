export default function LoadingState() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" aria-live="polite" aria-busy="true">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="h-36 rounded-lg bg-white border border-slate-200 overflow-hidden relative">
          <div className="absolute inset-0 animate-pulse bg-slate-100" />
        </div>
      ))}
      <span className="sr-only">Memuat data katalog…</span>
    </div>
  )
}
