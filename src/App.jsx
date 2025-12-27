import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import ProductDetail from './pages/ProductDetail'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/katalog" element={<Catalog />} />
            <Route path="/katalog/:category" element={<Catalog />} />
            <Route path="/produk/:slug" element={<ProductDetail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
