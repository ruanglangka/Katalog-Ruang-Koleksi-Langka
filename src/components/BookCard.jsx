import { Link } from 'react-router-dom'
import { formatValue, splitBibliographic } from '../utils/fields'

export default function BookCard({ book, fields }) {
  const titleRaw = fields.title ? book[fields.title] : null
  const { primary: titleLine, secondary: titleDetail } = splitBibliographic(titleRaw)

  const authorRaw = fields.author ? book[fields.author] : null
  const callNumber = fields.callNumber ? book[fields.callNumber] : null
  const publisher = fields.publisher ? book[fields.publisher] : null
  const year = fields.year ? book[fields.year] : null
  const subject = fields.subject ? book[fields.subject] : null

  // Kalau tidak ada kolom "Pengarang" terpisah, pakai baris ke-2+ dari
  // kolom bibliografis (penerbit/tahun/halaman) sebagai info tambahan.
  const subtitle = authorRaw ? formatValue(authorRaw) : titleDetail

  return (
    <Link
      to={`/buku/${book.id}`}
      className="group flex flex-col bg-white border border-slate-200 rounded-lg p-5 hover:border-accent-300 hover:shadow-md transition-all focus-visible:outline focus-visible:outline-accent-500"
    >
      <div className="flex items-start justify-between gap-3">
        {callNumber && (
          <span className="font-mono text-[11px] font-medium text-accent-700 bg-accent-50 rounded px-2 py-1">
            {formatValue(callNumber)}
          </span>
        )}
        {subject && (
          <span className="text-[11px] text-slate-500 bg-slate-100 rounded px-2 py-1 truncate max-w-[45%]">
            {formatValue(subject)}
          </span>
        )}
      </div>

      <h3 className="font-display text-lg font-semibold leading-snug text-slate-800 line-clamp-2 mt-3 group-hover:text-accent-700">
        {titleLine || `Koleksi #${book.id}`}
      </h3>

      {subtitle && (
        <p className="text-sm text-slate-500 mt-1 font-body line-clamp-1">{subtitle}</p>
      )}

      <div className="flex items-center gap-2 mt-auto pt-4 text-xs text-slate-400 font-body">
        {publisher && <span className="truncate">{formatValue(publisher)}</span>}
        {publisher && year && <span aria-hidden="true">·</span>}
        {year && <span>{formatValue(year)}</span>}
      </div>
    </Link>
  )
}