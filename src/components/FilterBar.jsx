export default function FilterBar({
  filterableHeaders,
  sortableHeaders,
  filterField,
  filterValue,
  filterOptions,
  onFilterFieldChange,
  onFilterValueChange,
  sortField,
  onSortFieldChange,
  resultCount,
  totalCount,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm px-4 py-3.5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between font-body text-sm">
        <div className="flex flex-wrap items-center gap-3">
          {filterableHeaders.length > 0 ? (
            <>
              <FieldSelect
                icon={<FilterIcon />}
                label="Filter"
                value={filterField}
                onChange={(v) => {
                  onFilterFieldChange(v)
                  onFilterValueChange('')
                }}
                headers={filterableHeaders}
                includeEmpty="Semua kolom"
              />
              {filterField && (
                <select
                  value={filterValue}
                  onChange={(e) => onFilterValueChange(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-md pl-3 pr-8 py-2 text-slate-700 outline-none focus:border-accent-500 focus:bg-white transition-colors max-w-[10rem] sm:max-w-none"
                >
                  <option value="">Semua nilai</option>
                  {filterOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              )}
              <span className="w-px h-6 bg-slate-200 hidden sm:block" aria-hidden="true" />
            </>
          ) : null}

          <FieldSelect
            icon={<SortIcon />}
            label="Urutkan"
            value={sortField}
            onChange={onSortFieldChange}
            headers={sortableHeaders}
            includeEmpty="Urutan asli"
          />
        </div>

        <p className="text-slate-500 whitespace-nowrap pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100 sm:border-none">
          <span className="font-semibold text-slate-800">{resultCount.toLocaleString('id-ID')}</span>
          {' '}dari {totalCount.toLocaleString('id-ID')} koleksi
        </p>
      </div>
    </div>
  )
}

function FieldSelect({ icon, label, value, onChange, headers, includeEmpty }) {
  return (
    <label className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-md pl-2.5 pr-1 focus-within:border-accent-500 focus-within:bg-white transition-colors">
      <span className="text-slate-400" aria-hidden="true">{icon}</span>
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent pl-1 pr-6 py-2 text-slate-700 outline-none"
        title={label}
      >
        <option value="">{includeEmpty}</option>
        {headers.map((h) => (
          <option key={h} value={h}>{h}</option>
        ))}
      </select>
    </label>
  )
}

function FilterIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 5h16M7 12h10M10.5 19h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function SortIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 4v16M7 4l-3 3M7 4l3 3M17 20V4M17 20l-3-3M17 20l3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}