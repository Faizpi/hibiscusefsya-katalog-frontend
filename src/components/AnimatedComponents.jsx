import { useEffect, useState } from 'react'
import './AnimatedComponents.css'

// Marquee Text Component (Running Text)
export function MarqueeText({ children, speed = 20, className = '' }) {
  return (
    <div className={`marquee-wrapper ${className}`}>
      <div className="marquee-track" style={{ animationDuration: `${speed}s` }}>
        <span className="marquee-text">{children}</span>
        <span className="marquee-text">{children}</span>
        <span className="marquee-text">{children}</span>
        <span className="marquee-text">{children}</span>
      </div>
    </div>
  )
}

// Letter by Letter Reveal Component
export function LetterReveal({ text, className = '', delay = 50, startDelay = 0 }) {
  const [letters, setLetters] = useState([])
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), startDelay)
    return () => clearTimeout(timer)
  }, [startDelay])

  useEffect(() => {
    if (!started) return

    const chars = text.split('')
    const letterElements = chars.map((char, index) => ({
      char,
      delay: index * delay,
      visible: false
    }))
    setLetters(letterElements)

    chars.forEach((_, index) => {
      setTimeout(() => {
        setLetters(prev => prev.map((letter, i) => 
          i === index ? { ...letter, visible: true } : letter
        ))
      }, index * delay)
    })
  }, [text, delay, started])

  return (
    <span className={`letter-reveal-container ${className}`}>
      {letters.map((letter, index) => (
        <span
          key={index}
          className={`letter ${letter.visible ? 'visible' : ''}`}
          style={{ transitionDelay: `${letter.delay}ms` }}
        >
          {letter.char === ' ' ? '\u00A0' : letter.char}
        </span>
      ))}
    </span>
  )
}

// Word by Word Reveal Component
export function WordReveal({ text, className = '', delay = 100, startDelay = 0 }) {
  const [words, setWords] = useState([])
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), startDelay)
    return () => clearTimeout(timer)
  }, [startDelay])

  useEffect(() => {
    if (!started) return

    const wordArray = text.split(' ')
    const wordElements = wordArray.map((word, index) => ({
      word,
      delay: index * delay,
      visible: false
    }))
    setWords(wordElements)

    wordArray.forEach((_, index) => {
      setTimeout(() => {
        setWords(prev => prev.map((w, i) => 
          i === index ? { ...w, visible: true } : w
        ))
      }, index * delay)
    })
  }, [text, delay, started])

  return (
    <span className={`word-reveal-container ${className}`}>
      {words.map((word, index) => (
        <span
          key={index}
          className={`word ${word.visible ? 'visible' : ''}`}
        >
          {word.word}{' '}
        </span>
      ))}
    </span>
  )
}

// Typewriter Effect Component
export function Typewriter({ texts, speed = 100, deleteSpeed = 50, pauseTime = 2000 }) {
  const [displayText, setDisplayText] = useState('')
  const [textIndex, setTextIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentText = texts[textIndex]

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1))
        } else {
          setTimeout(() => setIsDeleting(true), pauseTime)
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1))
        } else {
          setIsDeleting(false)
          setTextIndex((prev) => (prev + 1) % texts.length)
        }
      }
    }, isDeleting ? deleteSpeed : speed)

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, textIndex, texts, speed, deleteSpeed, pauseTime])

  return (
    <span className="typewriter">
      {displayText}
      <span className="cursor">|</span>
    </span>
  )
}

// Counter Animation Component
export function AnimatedCounter({ target, duration = 2000, prefix = '', suffix = '' }) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (hasAnimated) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          let startTime = null
          const animate = (timestamp) => {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / duration, 1)
            setCount(Math.floor(progress * target))
            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5 }
    )

    const element = document.getElementById(`counter-${target}`)
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [target, duration, hasAnimated])

  return (
    <span id={`counter-${target}`} className="animated-counter">
      {prefix}{count}{suffix}
    </span>
  )
}

// Floating Elements Component
export function FloatingElement({ children, amplitude = 10, duration = 3 }) {
  return (
    <div 
      className="floating-element"
      style={{
        animation: `float ${duration}s ease-in-out infinite`,
        '--float-amplitude': `${amplitude}px`
      }}
    >
      {children}
    </div>
  )
}

// Parallax Container
export function ParallaxContainer({ children, speed = 0.5 }) {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.pageYOffset * speed)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return (
    <div 
      className="parallax-container"
      style={{ transform: `translateY(${offset}px)` }}
    >
      {children}
    </div>
  )
}

// Scroll Progress Indicator
export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const currentProgress = (window.pageYOffset / totalHeight) * 100
      setProgress(currentProgress)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="scroll-progress">
      <div className="scroll-progress-bar" style={{ width: `${progress}%` }} />
    </div>
  )
}
