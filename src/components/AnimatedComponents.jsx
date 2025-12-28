import React, { useEffect, useState, useRef } from 'react'
import './AnimatedComponents.css'

// Hook untuk detect visibility dengan re-trigger
function useInView(options = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px'
      }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [options.threshold, options.rootMargin])

  return { ref, isVisible }
}

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

// Letter by Letter Reveal Component - RE-TRIGGERS ON SCROLL
export function LetterReveal({ text, className = '', delay = 50, startDelay = 0 }) {
  const { ref, isVisible } = useInView({ threshold: 0.2 })
  const [words, setWords] = useState([])
  const [animationKey, setAnimationKey] = useState(0)

  // Reset and re-animate when visibility changes
  useEffect(() => {
    if (isVisible) {
      setAnimationKey(prev => prev + 1)
    } else {
      // Reset when out of view
      setWords([])
    }
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    const timer = setTimeout(() => {
      const rawWords = (text || '').split(' ')
      let globalIndex = 0

      const mapped = rawWords.map((w) => {
        const chars = w.split('')
        const letters = chars.map((char, i) => ({
          char,
          delay: (globalIndex + i) * delay,
          visible: false
        }))
        globalIndex += chars.length + 1 // include space
        return { letters }
      })

      setWords(mapped)

      // Trigger visibility per letter sequentially
      let triggerIndex = 0
      rawWords.forEach((w, wi) => {
        const chars = w.split('')
        chars.forEach((_, ci) => {
          setTimeout(() => {
            setWords(prev => prev.map((word, idx) => {
              if (idx !== wi) return word
              const updatedLetters = word.letters.map((l, li) => (
                li === ci ? { ...l, visible: true } : l
              ))
              return { ...word, letters: updatedLetters }
            }))
          }, triggerIndex * delay)
          triggerIndex += 1
        })
        // Skip delay position for the space between words
        triggerIndex += 1
      })
    }, startDelay)

    return () => clearTimeout(timer)
  }, [text, delay, startDelay, isVisible, animationKey])

  return (
    <span ref={ref} className={`letter-reveal-container ${className}`}>
      {words.map((word, wIdx) => (
        <React.Fragment key={`${animationKey}-w-${wIdx}`}>
          <span className="letter-word">
            {word.letters.map((letter, lIdx) => (
              <span
                key={`${animationKey}-${wIdx}-${lIdx}`}
                className={`letter ${letter.visible ? 'visible' : ''}`}
                style={{ transitionDelay: `${letter.delay}ms` }}
              >
                {letter.char}
              </span>
            ))}
          </span>
          {wIdx < words.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </span>
  )
}

// Word by Word Reveal Component - RE-TRIGGERS ON SCROLL
export function WordReveal({ text, className = '', delay = 100, startDelay = 0 }) {
  const { ref, isVisible } = useInView({ threshold: 0.2 })
  const [words, setWords] = useState([])
  const [animationKey, setAnimationKey] = useState(0)

  useEffect(() => {
    if (isVisible) {
      setAnimationKey(prev => prev + 1)
    } else {
      setWords([])
    }
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    const timer = setTimeout(() => {
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
    }, startDelay)

    return () => clearTimeout(timer)
  }, [text, delay, startDelay, isVisible, animationKey])

  return (
    <span ref={ref} className={`word-reveal-container ${className}`}>
      {words.map((word, index) => (
        <span
          key={`${animationKey}-${index}`}
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

// Counter Animation Component - RE-TRIGGERS ON SCROLL
export function AnimatedCounter({ target, duration = 2000, prefix = '', suffix = '' }) {
  const { ref, isVisible } = useInView({ threshold: 0.5 })
  const [count, setCount] = useState(0)
  const animationRef = useRef(null)

  useEffect(() => {
    if (isVisible) {
      // Start counting animation
      setCount(0)
      let startTime = null
      
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / duration, 1)
        setCount(Math.floor(progress * target))
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate)
        }
      }
      animationRef.current = requestAnimationFrame(animate)
    } else {
      // Reset when out of view
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      setCount(0)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [target, duration, isVisible])

  return (
    <span ref={ref} className="animated-counter">
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

// ScrollReveal Wrapper Component - RE-TRIGGERS ON SCROLL
export function ScrollReveal({ 
  children, 
  className = '', 
  animation = 'fadeInUp', 
  delay = 0, 
  duration = 600,
  threshold = 0.1,
  style: customStyle = {}
}) {
  const { ref, isVisible } = useInView({ threshold })

  const animations = {
    fadeInUp: { from: { opacity: 0, transform: 'translateY(40px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
    fadeInDown: { from: { opacity: 0, transform: 'translateY(-40px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
    fadeInLeft: { from: { opacity: 0, transform: 'translateX(-40px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
    fadeInRight: { from: { opacity: 0, transform: 'translateX(40px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
    fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
    scaleIn: { from: { opacity: 0, transform: 'scale(0.8)' }, to: { opacity: 1, transform: 'scale(1)' } },
    rotateIn: { from: { opacity: 0, transform: 'rotate(-10deg) scale(0.9)' }, to: { opacity: 1, transform: 'rotate(0) scale(1)' } },
    flipIn: { from: { opacity: 0, transform: 'perspective(600px) rotateX(-90deg)' }, to: { opacity: 1, transform: 'perspective(600px) rotateX(0)' } },
    slideInUp: { from: { opacity: 0, transform: 'translateY(100px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
    zoomIn: { from: { opacity: 0, transform: 'scale(0.5)' }, to: { opacity: 1, transform: 'scale(1)' } },
  }

  const anim = animations[animation] || animations.fadeInUp
  const currentStyle = isVisible ? anim.to : anim.from

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${className} ${isVisible ? 'revealed' : ''}`}
      style={{
        ...currentStyle,
        ...customStyle,
        transition: `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
        willChange: 'transform, opacity'
      }}
    >
      {children}
    </div>
  )
}

// Stagger Children Animation - RE-TRIGGERS ON SCROLL
export function StaggerChildren({ children, className = '', staggerDelay = 100, animation = 'fadeInUp' }) {
  const { ref, isVisible } = useInView({ threshold: 0.1 })
  const [key, setKey] = useState(0)

  useEffect(() => {
    if (isVisible) {
      setKey(prev => prev + 1)
    }
  }, [isVisible])

  return (
    <div ref={ref} className={`stagger-container ${className}`}>
      {React.Children.map(children, (child, index) => (
        <ScrollReveal 
          key={`${key}-${index}`}
          animation={animation} 
          delay={isVisible ? index * staggerDelay : 0}
          duration={500}
        >
          {child}
        </ScrollReveal>
      ))}
    </div>
  )
}
