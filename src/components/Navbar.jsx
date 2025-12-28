import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const logoSrc = `${import.meta.env.BASE_URL}logo.png`
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])

  // Handle click untuk section links
  const handleSectionClick = (e, sectionId) => {
    e.preventDefault()
    
    // Jika di halaman lain, navigate ke home dulu dengan hash
    if (location.pathname !== '/') {
      navigate('/#' + sectionId)
    } else {
      // Jika sudah di home, langsung scroll
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <header className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon"><img src={logoSrc} alt="Hibiscus Efsya" style={{ width: 48, height: 48, objectFit: 'contain' }} /></span>
          <div className="logo-text">
            <span className="logo-name">Hibiscus Efsya</span>
            <span className="logo-tagline">part of M.B.K Indonesia</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="navbar-nav">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Beranda
          </Link>
          <Link 
            to="/katalog" 
            className={`nav-link ${location.pathname.startsWith('/katalog') ? 'active' : ''}`}
          >
            Katalog
          </Link>
          <a href="#about" onClick={(e) => handleSectionClick(e, 'about')} className="nav-link">Tentang Kami</a>
          <a href="#contact" onClick={(e) => handleSectionClick(e, 'contact')} className="nav-link">Kontak</a>
        </nav>

        {/* CTA Button */}
        <Link to="/katalog" className="navbar-cta btn btn-primary btn-sm">
          Lihat Produk
        </Link>

        {/* Mobile Menu Toggle */}
        <button 
          className={`navbar-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar-mobile ${isMobileMenuOpen ? 'active' : ''}`}>
        <nav className="mobile-nav">
          <Link to="/" className="mobile-nav-link">Beranda</Link>
          <Link to="/katalog" className="mobile-nav-link">Katalog</Link>
          <a href="#about" onClick={(e) => handleSectionClick(e, 'about')} className="mobile-nav-link">Tentang Kami</a>
          <a href="#contact" onClick={(e) => handleSectionClick(e, 'contact')} className="mobile-nav-link">Kontak</a>
          <Link to="/katalog" className="btn btn-primary btn-block">
            Lihat Produk
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
