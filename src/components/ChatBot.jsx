import { useState, useEffect, useRef } from 'react'
import { getHomepageData, getProducts, getCategories } from '../services/api'
import './ChatBot.css'

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [productData, setProductData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [settingsData, setSettingsData] = useState({})
  const [dataLoaded, setDataLoaded] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // WhatsApp link for human support
  const whatsappLink = 'https://wa.me/6287871656326?text=Halo%20Hibiscus%20Efsya%2C%20saya%20butuh%20bantuan'

  // Quick suggestions
  const quickSuggestions = [
    { text: '📦 Lihat produk unggulan', query: 'Lihat produk unggulan' },
    { text: '🏷️ Kategori produk', query: 'Kategori' },
    { text: '💰 Kisaran Harga', query: 'Berapa kisaran harga' },
    { text: '📍 Cara beli', query: 'Cara beli' },
    { text: '✨ Tentang Hibiscus Efsya', query: 'Tentang Hibiscus Efsya' },
  ]

  // Load all data on mount
  useEffect(() => {
    loadAllData()
  }, [])

  // Scroll to bottom when new messages
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadAllData = async () => {
    try {
      const [homepageRes, productsRes, categoriesRes] = await Promise.all([
        getHomepageData(),
        getProducts(),
        getCategories()
      ])

      if (homepageRes?.data) {
        setSettingsData(homepageRes.data.settings || {})
        if (homepageRes.data.categories) {
          setCategoryData(homepageRes.data.categories)
        }
      }

      if (productsRes?.data) {
        setProductData(productsRes.data)
      }

      if (categoriesRes?.data) {
        setCategoryData(categoriesRes.data)
      }

      setDataLoaded(true)
    } catch (err) {
      console.log('Chatbot: Using fallback data')
      setDataLoaded(true)
    }
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const addBotMessage = (text, showSuggestions = false) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'bot',
      text,
      showSuggestions,
      timestamp: new Date()
    }])
  }

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      text,
      timestamp: new Date()
    }])
  }

  const handleSendMessage = (text = inputValue) => {
    if (!text.trim()) return

    addUserMessage(text)
    setInputValue('')
    setIsTyping(true)

    // Simulate thinking delay
    setTimeout(() => {
      const response = generateResponse(text.toLowerCase())
      setIsTyping(false)
      addBotMessage(response.text, response.showSuggestions)
    }, 800 + Math.random() * 700)
  }

  const generateResponse = (query) => {
    // Normalize query
    const q = query.toLowerCase().trim()

    // === GREETINGS ===
    if (q.match(/^(hai|halo|hi|hello|hey|p|permisi|selamat)/)) {
      return {
        text: `Halo! 😊 Senang bertemu dengan Anda!\n\nSaya siap membantu Anda menemukan produk ${settingsData?.site_name || 'Hibiscus Efsya'} yang tepat. Silakan tanyakan tentang produk, harga, atau kategori yang Anda cari!`,
        showSuggestions: true
      }
    }

    // === PRODUCT QUERIES ===
    if (q.match(/(produk|barang|jual|tersedia|ada apa|apa saja|apa aja)/)) {
      if (q.match(/(unggulan|terbaik|favorit|populer|best|rekomendasi)/)) {
        const featured = productData.filter(p => p.featured)
        if (featured.length > 0) {
          const list = featured.slice(0, 4).map(p => 
            `• ${p.name} - ${p.price_formatted || formatPrice(p.price)}`
          ).join('\n')
          return {
            text: `⭐ Berikut produk unggulan kami:\n\n${list}\n\nMau tahu lebih detail tentang produk tertentu? Silakan tanyakan!`,
            showSuggestions: false
          }
        }
      }

      if (productData.length > 0) {
        const sampleProducts = productData.slice(0, 5).map(p => 
          `• ${p.name} (${p.category_name || 'Kategori'})`
        ).join('\n')
        return {
          text: `📦 Kami memiliki ${productData.length} produk perawatan tubuh berkualitas!\n\nBeberapa produk kami:\n${sampleProducts}\n\nKetik nama produk untuk info lebih detail, atau tanyakan berdasarkan kategori!`,
          showSuggestions: true
        }
      }
    }

    // === CATEGORY QUERIES ===
    if (q.match(/(kategori|jenis|macam|tipe|varian)/)) {
      if (categoryData.length > 0) {
        const list = categoryData.map(c => 
          `• ${c.name} (${c.product_count || 0} produk)`
        ).join('\n')
        return {
          text: `🏷️ Kategori produk kami:\n\n${list}\n\nMau lihat produk dari kategori tertentu? Ketik nama kategorinya!`,
          showSuggestions: false
        }
      }
    }

    // === SPECIFIC CATEGORY SEARCH ===
    if (q.match(/(deodorant|deodoran|deo|roll on|roll-on)/)) {
      const products = productData.filter(p => 
        p.category_name?.toLowerCase().includes('deodorant') ||
        p.name?.toLowerCase().includes('deodorant')
      )
      if (products.length > 0) {
        const list = products.slice(0, 4).map(p => 
          `• ${p.name} - ${p.price_formatted || formatPrice(p.price)}`
        ).join('\n')
        return {
          text: `🧴 Produk Deodorant Roll On kami:\n\n${list}\n\nDeodorant M.B.K memberikan perlindungan hingga 24 jam dari bau badan. Tersedia untuk pria dan wanita!`,
          showSuggestions: true
        }
      }
    }

    if (q.match(/(bedak|powder|tabur|biang keringat)/)) {
      const products = productData.filter(p => 
        p.category_name?.toLowerCase().includes('powder') ||
        p.category_name?.toLowerCase().includes('bedak') ||
        p.name?.toLowerCase().includes('powder') ||
        p.name?.toLowerCase().includes('bedak')
      )
      if (products.length > 0) {
        const list = products.slice(0, 4).map(p => 
          `• ${p.name} - ${p.price_formatted || formatPrice(p.price)}`
        ).join('\n')
        return {
          text: `✨ Produk Bedak & Powder kami:\n\n${list}\n\nBedak tabur M.B.K membantu menyerap keringat dan memberikan aroma segar sepanjang hari!`,
          showSuggestions: true
        }
      }
    }

    if (q.match(/(body mist|mist|parfum|wangi)/)) {
      const products = productData.filter(p => 
        p.category_name?.toLowerCase().includes('mist') ||
        p.name?.toLowerCase().includes('mist')
      )
      if (products.length > 0) {
        const list = products.map(p => 
          `• ${p.name} - ${p.price_formatted || formatPrice(p.price)}`
        ).join('\n')
        return {
          text: `🌸 Produk Body Mist kami:\n\n${list}\n\nBody Mist M.B.K memberikan keharuman segar yang tahan lama!`,
          showSuggestions: true
        }
      }
    }

    if (q.match(/(lotion|body lotion|pelembab)/)) {
      const products = productData.filter(p => 
        p.category_name?.toLowerCase().includes('lotion') ||
        p.name?.toLowerCase().includes('lotion')
      )
      if (products.length > 0) {
        const list = products.map(p => 
          `• ${p.name} - ${p.price_formatted || formatPrice(p.price)}`
        ).join('\n')
        return {
          text: `🧴 Produk Body Lotion kami:\n\n${list}\n\nBody Lotion M.B.K melembabkan kulit dan memberikan aroma harum!`,
          showSuggestions: true
        }
      }
    }

    // === PRICE QUERIES ===
    if (q.match(/(harga|price|berapa|biaya|murah|mahal)/)) {
      // Search for specific product in query
      const matchedProduct = productData.find(p => 
        q.includes(p.name?.toLowerCase()) ||
        p.name?.toLowerCase().split(' ').some(word => q.includes(word) && word.length > 3)
      )

      if (matchedProduct) {
        return {
          text: `💰 Harga ${matchedProduct.name}:\n\n${matchedProduct.price_formatted || formatPrice(matchedProduct.price)}\n\n${matchedProduct.description || 'Produk berkualitas dari M.B.K Indonesia.'}\n\nMau pesan? Silakan hubungi kami via WhatsApp!`,
          showSuggestions: true
        }
      }

      // General price info
      const priceRange = productData.length > 0 ? {
        min: Math.min(...productData.map(p => parseInt(p.price) || 0)),
        max: Math.max(...productData.map(p => parseInt(p.price) || 0))
      } : { min: 9000, max: 35000 }

      return {
        text: `💰 Range harga produk kami:\n\n${formatPrice(priceRange.min)} - ${formatPrice(priceRange.max)}\n\nHarga sangat terjangkau untuk kualitas premium! Mau tahu harga produk tertentu? Sebutkan nama produknya ya!`,
        showSuggestions: true
      }
    }

    // === ABOUT / COMPANY INFO ===
    if (q.match(/(tentang|about|siapa|apa itu|hibiscus|efsya|mbk|m\.b\.k)/)) {
      return {
        text: `🌺 **${settingsData?.site_name || 'Hibiscus Efsya'}**\n\n${settingsData?.about_content || 'Hibiscus Efsya adalah brand produk perawatan tubuh dibawah naungan M.B.K Indonesia.'}\n\n✅ Bersertifikat Halal MUI\n✅ BPOM Approved\n✅ Produksi Indonesia\n\nKami menyediakan deodorant, bedak tabur, body mist, dan body lotion berkualitas!`,
        showSuggestions: true
      }
    }

    // === HOW TO BUY ===
    if (q.match(/(beli|order|pesan|cara|bisa|gimana|bagaimana|dimana|di mana|purchase|buy)/)) {
      return {
        text: `🛒 Cara membeli produk ${settingsData?.site_name || 'Hibiscus Efsya'}:\n\n1️⃣ Pilih produk yang Anda inginkan di katalog kami\n2️⃣ Catat produk yang ingin dibeli\n3️⃣ Hubungi kami via WhatsApp\n4️⃣ Konfirmasi pesanan dan alamat pengiriman\n5️⃣ Lakukan pembayaran\n6️⃣ Produk akan dikirim ke alamat Anda!\n\n📱 Klik tombol "Chat WhatsApp" di bawah untuk langsung terhubung dengan tim kami!`,
        showSuggestions: true
      }
    }

    // === CONTACT ===
    if (q.match(/(kontak|contact|hubungi|telepon|telpon|hp|nomor|wa|whatsapp|email)/)) {
      return {
        text: `📞 Hubungi Kami:\n\n📱 WhatsApp: ${settingsData?.contact_phone || '+62 812 3456 7890'}\n📧 Email: ${settingsData?.contact_email || 'info@hibiscusefsya.com'}\n📍 Lokasi: ${settingsData?.contact_address || 'Jakarta, Indonesia'}\n\nAtau klik tombol "Chat WhatsApp" untuk langsung terhubung dengan tim kami!`,
        showSuggestions: true
      }
    }

    // === HALAL / CERTIFICATION ===
    if (q.match(/(halal|sertifikat|bpom|aman|safe|certified)/)) {
      return {
        text: `✅ Keamanan Produk Kami:\n\n🕌 **Bersertifikat Halal MUI** - Aman digunakan sesuai syariat Islam\n\n🛡️ **BPOM Approved** - Telah terdaftar dan teruji di Badan POM\n\n🏭 **Produksi Indonesia** - Dibuat dengan standar kualitas tinggi\n\nSemua produk M.B.K Indonesia dijamin aman dan berkualitas!`,
        showSuggestions: true
      }
    }

    // === THANKS ===
    if (q.match(/(terima kasih|makasih|thanks|thank you|thx|tq)/)) {
      return {
        text: `Sama-sama! 😊\n\nSenang bisa membantu Anda. Jika ada pertanyaan lain tentang produk ${settingsData?.site_name || 'Hibiscus Efsya'}, jangan ragu untuk bertanya ya!\n\nSemoga harimu menyenangkan! 🌸`,
        showSuggestions: true
      }
    }

    // === SEARCH SPECIFIC PRODUCT BY NAME ===
    const searchProduct = productData.find(p => {
      const productName = p.name?.toLowerCase() || ''
      const words = productName.split(' ').filter(w => w.length > 2)
      return words.some(word => q.includes(word))
    })

    if (searchProduct) {
      return {
        text: `📦 **${searchProduct.name}**\n\n💰 Harga: ${searchProduct.price_formatted || formatPrice(searchProduct.price)}\n📂 Kategori: ${searchProduct.category_name || '-'}\n\n${searchProduct.description || 'Produk perawatan tubuh berkualitas dari M.B.K Indonesia.'}\n\nTertarik? Hubungi kami via WhatsApp untuk pemesanan!`,
        showSuggestions: true
      }
    }

    // === FALLBACK - CAN'T UNDERSTAND ===
    return {
      text: `Hmm, saya belum sepenuhnya memahami pertanyaan Anda. 🤔\n\nAnda bisa bertanya tentang:\n• Produk dan harga\n• Kategori produk\n• Cara pembelian\n• Informasi tentang ${settingsData?.site_name || 'Hibiscus Efsya'}\n\nAtau jika butuh bantuan lebih lanjut, silakan chat langsung dengan tim kami via WhatsApp! 👇`,
      showSuggestions: true
    }
  }

  const formatPrice = (price) => {
    if (!price) return 'Rp -'
    return `Rp ${parseInt(price).toLocaleString('id-ID')}`
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSuggestionClick = (query) => {
    handleSendMessage(query)
  }

  return (
    <>
      {/* Floating Chat Button */}
      <button 
        className={`chatbot-toggle ${isOpen ? 'active' : ''}`}
        onClick={toggleChat}
        aria-label="Toggle chatbot"
      >
        <div className="chatbot-toggle-icon">
          {isOpen ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="5"/>
              <path d="M8 8h.01M16 8h.01"/>
              <path d="M9 11s1 1 3 1 3-1 3-1"/>
              <path d="M12 13v3"/>
              <path d="M8 21h8"/>
              <path d="M10 21v-3"/>
              <path d="M14 21v-3"/>
              <rect x="6" y="3" width="12" height="10" rx="2"/>
              <path d="M4 7h2M18 7h2"/>
              <path d="M9 3V1M15 3V1"/>
            </svg>
          )}
        </div>
        <span className="chatbot-toggle-pulse"></span>
      </button>

      {/* Chat Window */}
      <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
        {/* Glass Header */}
        <div className="chatbot-header">
          <div className="chatbot-header-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="8" r="5"/>
              <path d="M8 8h.01M16 8h.01"/>
              <path d="M9 11s1 1 3 1 3-1 3-1"/>
            </svg>
          </div>
          <div className="chatbot-header-info">
            <h4>Asisten Hibiscus</h4>
            <span className="chatbot-status">
              <span className="status-dot"></span>
              Online
            </span>
          </div>
          <button className="chatbot-close" onClick={toggleChat}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Messages Area */}
        <div className="chatbot-messages">
          {messages.length === 0 && (
            <div className="chatbot-welcome">
              <div className="welcome-icon">🌺</div>
              <h4>Selamat Datang!</h4>
              <p>Tanyakan apa saja tentang produk kami</p>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.type}`}>
              {msg.type === 'bot' && (
                <div className="message-avatar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="8" r="4"/>
                    <path d="M9 8h.01M15 8h.01"/>
                  </svg>
                </div>
              )}
              <div className="message-content">
                <div className="message-bubble">
                  {msg.text.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < msg.text.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </div>
                {msg.showSuggestions && msg.type === 'bot' && (
                  <div className="message-suggestions">
                    {quickSuggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        className="suggestion-btn"
                        onClick={() => handleSuggestionClick(suggestion.query)}
                      >
                        {suggestion.text}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="message bot">
              <div className="message-avatar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="4"/>
                  <path d="M9 8h.01M15 8h.01"/>
                </svg>
              </div>
              <div className="message-content">
                <div className="message-bubble typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions (when empty) */}
        {messages.length === 0 && (
          <div className="chatbot-quick-suggestions">
            {quickSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                className="quick-suggestion-btn"
                onClick={() => handleSuggestionClick(suggestion.query)}
              >
                {suggestion.text}
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="chatbot-input-area">
          <input
            ref={inputRef}
            type="text"
            placeholder="Ketik pesan..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isTyping}
          />
          <button 
            className="chatbot-send-btn"
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isTyping}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>
          </button>
          <a 
            href={whatsappLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="chatbot-wa-btn"
            title="Chat WhatsApp"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
        </div>
      </div>
    </>
  )
}

export default ChatBot
