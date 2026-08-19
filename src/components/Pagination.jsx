export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = getPageList(page, totalPages)

  return (
    <nav className="flex items-center justify-center gap-1 flex-wrap" aria-label="Navigasi halaman">
      <PageButton disabled={page === 1} onClick={() => onPageChange(page - 1)} label="Sebelumnya">
        ‹
      </PageButton>

      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-slate-400 font-body text-sm">…</span>
        ) : (
          <PageButton
            key={p}
            active={p === page}
            onClick={() => onPageChange(p)}
            label={`Halaman ${p}`}
          >
            {p}
          </PageButton>
        )
      )}

      <PageButton disabled={page === totalPages} onClick={() => onPageChange(page + 1)} label="Berikutnya">
        ›
      </PageButton>
    </nav>
  )
}

function PageButton({ children, onClick, disabled, active, label }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      className={[
        'min-w-[2.25rem] h-9 px-2 rounded-md font-body text-sm font-medium transition-colors border',
        active
          ? 'bg-accent-500 text-white border-accent-500'
          : 'bg-white text-slate-600 border-slate-200 hover:border-accent-300 hover:text-accent-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-slate-200 disabled:hover:text-slate-600',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

function getPageList(current, total) {
  const delta = 1
  const range = []
  const rangeWithDots = []
  let last

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i)
    }
  }

  for (const i of range) {
    if (last) {
      if (i - last === 2) rangeWithDots.push(last + 1)
      else if (i - last > 2) rangeWithDots.push('…')
    }
    rangeWithDots.push(i)
    last = i
  }

  return rangeWithDots
}
