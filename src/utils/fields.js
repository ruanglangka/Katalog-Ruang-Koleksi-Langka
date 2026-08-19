
const KEYWORD_MAP = {
  no: ['no', 'nomor urut', 'nomor'],
  callNumber: ['nomor panggil', 'no panggil', 'call number', 'klasifikasi'],
  title: ['judul', 'data bibliografis', 'title'],
  author: ['pengarang', 'penulis', 'author'],
  publisher: ['penerbit'],
  year: ['tahun terbit', 'tahun'],
  isbn: ['isbn'],
  subject: ['subjek', 'subject', 'topik'],
  location: ['lokasi', 'rak'],
  accessionNumber: ['nomor induk', 'no induk'],
}

export function detectFields(headers) {
  const lower = headers.map((h) => h.toLowerCase().trim())
  const result = {}
  for (const [key, keywords] of Object.entries(KEYWORD_MAP)) {
    const match = headers.find((h, i) =>
      keywords.some((kw) => lower[i] === kw || lower[i].includes(kw))
    )
    result[key] = match || null
  }
  return result
}

export function formatValue(value) {
  if (value === null || value === undefined || value === '') return '—'
  return String(value)
}

// Kolom seperti "Data Bibliografis" sering berisi beberapa baris dalam satu sel
// (baris pertama = judul, baris berikutnya = penerbit/tahun/halaman, dst).
// Fungsi ini memisahkan baris pertama sebagai judul dan sisanya sebagai keterangan.
export function splitBibliographic(raw) {
  if (raw === null || raw === undefined) return { primary: null, secondary: null }
  const lines = String(raw)
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0)

  if (lines.length === 0) return { primary: null, secondary: null }
  return {
    primary: lines[0],
    secondary: lines.slice(1).join(' · ') || null,
  }
}