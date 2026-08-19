import { useMemo, useState } from 'react'
import Header from '../components/Header'
import SearchBar from '../components/SearchBar'
import FilterBar from '../components/FilterBar'
import BookCard from '../components/BookCard'
import Pagination from '../components/Pagination'
import LoadingState from '../components/LoadingState'
import EmptyState from '../components/EmptyState'
import { ApiConfigError } from '../api/booksApi'

const PAGE_SIZE = 24

export default function CatalogPage({ booksData }) {
  const { status, error, books, headers, fields, generatedAt, refresh } = booksData

  const [query, setQuery] = useState('')
  const [filterField, setFilterField] = useState('')
  const [filterValue, setFilterValue] = useState('')
  const [sortField, setSortField] = useState('')
  const [page, setPage] = useState(1)
  const [refreshing, setRefreshing] = useState(false)

  const filterableHeaders = useMemo(() => {
    if (books.length === 0) return []
    // Kolom hanya masuk akal dipakai sebagai FILTER kalau nilainya berulang
    // (mis. "Lokasi Ruang", "Subjek"). Kolom seperti "No" atau "Nomor Induk"
    // nilainya hampir selalu unik per baris, jadi tidak cocok dijadikan filter
    // (dropdown-nya akan berisi ribuan pilihan yang tidak berguna).
    const uniqueCap = Math.min(60, Math.max(15, Math.ceil(books.length * 0.02)))
    return headers.filter((h) => {
      const values = new Set()
      for (const b of books) {
        const v = b[h]
        if (v !== undefined && v !== null && String(v).trim() !== '') values.add(String(v))
        if (values.size > uniqueCap) return false
      }
      return values.size > 1 && values.size < books.length * 0.5
    })
  }, [books, headers])

  const filterOptions = useMemo(() => {
    if (!filterField) return []
    const values = new Set()
    books.forEach((b) => {
      const v = b[filterField]
      if (v !== undefined && v !== null && String(v).trim() !== '') values.add(String(v))
    })
    return Array.from(values).sort((a, b) => a.localeCompare(b, 'id'))
  }, [books, filterField])

  const filtered = useMemo(() => {
    let result = books

    if (filterField && filterValue) {
      result = result.filter((b) => String(b[filterField]) === filterValue)
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase()
      result = result.filter((b) =>
        headers.some((h) => String(b[h] ?? '').toLowerCase().includes(q))
      )
    }

    if (sortField) {
      result = [...result].sort((a, b) =>
        String(a[sortField] ?? '').localeCompare(String(b[sortField] ?? ''), 'id', { numeric: true })
      )
    }

    return result
  }, [books, query, filterField, filterValue, sortField, headers])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function handleSearchChange(v) {
    setQuery(v)
    setPage(1)
  }

  function handleFilterFieldChange(v) {
    setFilterField(v)
    setPage(1)
  }

  function handleFilterValueChange(v) {
    setFilterValue(v)
    setPage(1)
  }

  async function handleRefresh() {
    setRefreshing(true)
    await refresh()
    setRefreshing(false)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header total={books.length} generatedAt={generatedAt} onRefresh={handleRefresh} refreshing={refreshing} />

      {/* Panel pencarian mengambang, tumpang-tindih dengan hero navy */}
      <div className="max-w-6xl mx-auto px-5 -mt-6 relative z-10">
        <SearchBar value={query} onChange={handleSearchChange} />
      </div>

      <main className="max-w-6xl mx-auto px-5 py-8">
        {status === 'error' && (
          <EmptyState
            title={error instanceof ApiConfigError ? 'API belum dihubungkan' : 'Gagal memuat data'}
            description={error?.message}
            actionLabel="Coba lagi"
            onAction={() => refresh()}
          />
        )}

        {status === 'loading' && <LoadingState />}

        {status === 'ready' && (
          <div className="flex flex-col gap-5 mt-2">
            <FilterBar
              filterableHeaders={filterableHeaders}
              sortableHeaders={headers}
              filterField={filterField}
              filterValue={filterValue}
              filterOptions={filterOptions}
              onFilterFieldChange={handleFilterFieldChange}
              onFilterValueChange={handleFilterValueChange}
              sortField={sortField}
              onSortFieldChange={(v) => { setSortField(v); setPage(1) }}
              resultCount={filtered.length}
              totalCount={books.length}
            />

            {pageItems.length === 0 ? (
              <EmptyState
                title="Tidak ada buku yang cocok"
                description="Coba ubah kata kunci pencarian atau filter yang dipakai."
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pageItems.map((book) => (
                  <BookCard key={book.id} book={book} fields={fields} />
                ))}
              </div>
            )}

            <div className="pt-4">
              <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 mt-10">
      <div className="max-w-6xl mx-auto px-5 py-6 text-xs text-slate-400 font-body">
        Data disinkronkan langsung dari Google Spreadsheet.
      </div>
    </footer>
  )
}