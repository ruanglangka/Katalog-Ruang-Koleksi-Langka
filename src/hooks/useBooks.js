import { useCallback, useEffect, useState } from 'react'
import { fetchBooks } from '../api/booksApi'
import { detectFields } from '../utils/fields'

export function useBooks() {
  const [state, setState] = useState({
    status: 'loading', // 'loading' | 'error' | 'ready'
    error: null,
    books: [],
    headers: [],
    fields: {},
    generatedAt: null,
  })

  const load = useCallback(async (forceRefresh = false) => {
    setState((s) => ({ ...s, status: 'loading', error: null }))
    try {
      const json = await fetchBooks(forceRefresh)
      setState({
        status: 'ready',
        error: null,
        books: json.data || [],
        headers: json.meta?.headers || [],
        fields: detectFields(json.meta?.headers || []),
        generatedAt: json.meta?.generatedAt || null,
      })
    } catch (err) {
      setState((s) => ({ ...s, status: 'error', error: err }))
    }
  }, [])

  useEffect(() => {
    load(false)
  }, [load])

  return {
    ...state,
    refresh: () => load(true),
  }
}
