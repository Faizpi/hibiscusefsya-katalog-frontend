import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import ProductDetail from './pages/ProductDetail'
import ArticleDetail from './pages/ArticleDetail'

// Component untuk handle scroll ke section
function ScrollHandler() {
  const location = useLocation()

  useEffect(() => {
    // Jika ada hash di URL, scroll ke element tersebut
    if (location.hash) {
      const element = document.querySelector(location.hash)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
      }
    } else {
      // Scroll ke atas jika tidak ada hash
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [location])

  return null
}

function App() {
  return (
    <Router>
      <ScrollHandler />
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/katalog" element={<Catalog />} />
            <Route path="/katalog/:category" element={<Catalog />} />
            <Route path="/produk/:slug" element={<ProductDetail />} />
            <Route path="/artikel/:slug" element={<ArticleDetail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
