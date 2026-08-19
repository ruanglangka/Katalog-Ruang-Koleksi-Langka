const API_URL = import.meta.env.VITE_API_URL
const CACHE_KEY = 'katalog:books:v1'
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 jam

/**
 * @param {boolean} forceRefresh - lewati cache, ambil data terbaru dari spreadsheet
 */
export async function fetchBooks(forceRefresh = false) {
  if (!API_URL) {
    throw new ApiConfigError()
  }

  if (!forceRefresh) {
    const cached = readCache()
    if (cached) return cached
  }

  const res = await fetch(API_URL)
  if (!res.ok) {
    throw new Error(`Gagal mengambil data (status ${res.status})`)
  }
  const json = await res.json()
  if (json.error) {
    throw new Error(json.error)
  }

  writeCache(json)
  return json
}

export class ApiConfigError extends Error {
  constructor() {
    super('VITE_API_URL belum diatur. Lihat README.md untuk cara menghubungkan Google Apps Script.')
    this.name = 'ApiConfigError'
  }
}

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (Date.now() - parsed.savedAt > CACHE_TTL_MS) return null
    return parsed.payload
  } catch {
    return null
  }
}

function writeCache(payload) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), payload }))
  } catch {
    // localStorage penuh atau tidak tersedia — abaikan, aplikasi tetap jalan tanpa cache
  }
}

export function clearBooksCache() {
  try {
    localStorage.removeItem(CACHE_KEY)
  } catch {
    /* noop */
  }
}
