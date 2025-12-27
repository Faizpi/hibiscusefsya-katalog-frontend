import { useEffect, useRef, useState } from 'react'

// Custom hook for scroll reveal animations
export function useScrollReveal(options = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (!options.repeat) {
            observer.unobserve(element)
          }
        } else if (options.repeat) {
          setIsVisible(false)
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px'
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [options.threshold, options.rootMargin, options.repeat])

  return [ref, isVisible]
}

// Custom hook for letter-by-letter animation
export function useLetterAnimation(text, isVisible, delay = 50) {
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    if (!isVisible) {
      setDisplayedText('')
      return
    }

    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(interval)
      }
    }, delay)

    return () => clearInterval(interval)
  }, [text, isVisible, delay])

  return displayedText
}

// Component for animated text reveal
export function AnimatedText({ children, className = '', delay = 0 }) {
  const [ref, isVisible] = useScrollReveal()

  return (
    <span
      ref={ref}
      className={`${className} ${isVisible ? 'active' : ''}`}
      style={{
        display: 'inline-block',
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </span>
  )
}

export default useScrollReveal
