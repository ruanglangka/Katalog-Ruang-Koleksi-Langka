export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative">
      <label htmlFor="search" className="sr-only">Cari koleksi buku</label>
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
        <SearchIcon />
      </span>
      <input
        id="search"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Cari judul, pengarang, nomor panggil, ISBN…"
        className="w-full bg-white border border-slate-200 focus:border-accent-500 rounded-lg pl-11 pr-4 py-3.5 font-body text-[15px] text-slate-800 placeholder:text-slate-400 outline-none transition-colors shadow-sm"
      />
    </div>
  )
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
