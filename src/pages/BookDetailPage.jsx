import { Link, useParams } from 'react-router-dom'
import Header from '../components/Header'
import LoadingState from '../components/LoadingState'
import EmptyState from '../components/EmptyState'
import { formatValue, splitBibliographic } from '../utils/fields'

export default function BookDetailPage({ booksData }) {
  const { id } = useParams()
  const { status, books, headers, fields, generatedAt, refresh } = booksData

  const book = books.find((b) => String(b.id) === String(id))
  const titleRaw = fields.title ? book?.[fields.title] : null
  const { primary: titleLine } = splitBibliographic(titleRaw)
  const authorRaw = fields.author ? book?.[fields.author] : null
  const callNumber = fields.callNumber ? book?.[fields.callNumber] : null

  return (
    <div className="min-h-screen bg-slate-50">
      <Header total={books.length} generatedAt={generatedAt} onRefresh={refresh} refreshing={false} />

      <main className="max-w-3xl mx-auto px-5 -mt-6 relative z-10 pb-12">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-accent-700 font-body font-medium mb-4 bg-white border border-slate-200 rounded-md px-3 py-1.5 shadow-sm"
        >
          ← Kembali ke katalog
        </Link>

        {status === 'loading' && <LoadingState />}

        {status === 'ready' && !book && (
          <EmptyState
            title="Buku tidak ditemukan"
            description="Koleksi ini mungkin sudah dihapus atau ID-nya tidak valid."
          />
        )}

        {status === 'ready' && book && (
          <article className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 sm:px-8 py-7 border-b border-slate-100">
              {callNumber && (
                <span className="inline-block font-mono text-xs font-medium text-accent-700 bg-accent-50 rounded px-2.5 py-1 mb-3">
                  {formatValue(callNumber)}
                </span>
              )}
              <h1 className="font-display text-2xl sm:text-[28px] font-semibold text-slate-800 leading-snug">
                {titleLine || `Koleksi #${book.id}`}
              </h1>
              {authorRaw && (
                <p className="text-slate-500 font-body mt-1.5">{formatValue(authorRaw)}</p>
              )}
            </div>

            <dl>
              {headers.map((h, i) => (
                <div
                  key={h}
                  className={[
                    'grid grid-cols-3 gap-4 px-6 sm:px-8 py-3 text-sm',
                    i % 2 === 1 ? 'bg-slate-50/70' : '',
                  ].join(' ')}
                >
                  <dt className="col-span-1 text-slate-500 font-body font-medium">{h}</dt>
                  <dd className="col-span-2 text-slate-800 font-body whitespace-pre-line">
                    {formatValue(book[h])}
                  </dd>
                </div>
              ))}
            </dl>
          </article>
        )}
      </main>
    </div>
  )
}