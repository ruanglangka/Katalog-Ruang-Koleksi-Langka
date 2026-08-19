import { Routes, Route } from 'react-router-dom'
import { useBooks } from './hooks/useBooks'
import CatalogPage from './pages/CatalogPage'
import BookDetailPage from './pages/BookDetailPage'

export default function App() {
  const booksData = useBooks()

  return (
    <Routes>
      <Route path="/" element={<CatalogPage booksData={booksData} />} />
      <Route path="/buku/:id" element={<BookDetailPage booksData={booksData} />} />
    </Routes>
  )
}
