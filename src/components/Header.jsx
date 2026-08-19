import { Link } from 'react-router-dom'

export default function Header({ total, generatedAt, onRefresh, refreshing }) {
  return (
    <header className="bg-navy-700">
      <div className="max-w-6xl mx-auto px-6 py-10 sm:py-12">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <BookmarkIcon />
            <span className="font-body text-sm font-semibold tracking-[0.18em] text-navy-200 uppercase">
              Perpustakaan Grhatama Pustaka DIY
            </span>
          </Link>

          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="text-sm font-body font-medium text-navy-100 hover:text-white border border-navy-500 hover:border-navy-300 disabled:opacity-50 disabled:cursor-not-allowed px-3.5 py-1.5 rounded-md transition-colors"
          >
            {refreshing ? 'Menyegarkan…' : 'Segarkan data'}
          </button>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white mt-6 leading-tight">
          Koleksi Buku Ruang Langka
        </h1>
        <p className="text-navy-200 font-body text-sm mt-2">
          {total.toLocaleString('id-ID')} judul tersedia
          {generatedAt && <> · diperbarui {formatDateTime(generatedAt)}</>}
        </p>
      </div>
    </header>
  )
}

function BookmarkIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-4-7 4V4.5a1 1 0 0 1 1-1Z"
        stroke="#B7C6DA"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function formatDateTime(iso) {
  try {
    return new Date(iso).toLocaleString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    })
  } catch {
    return iso
  }
}
