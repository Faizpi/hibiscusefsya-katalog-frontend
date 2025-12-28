import { useEffect, useRef, useState } from 'react'

// Custom hook for scroll reveal animations
// Now supports re-triggering on every scroll (both up and down)
export function useScrollReveal(options = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Always update visibility state for re-triggering animations
        setIsVisible(entry.isIntersecting)
        
        if (entry.isIntersecting) {
          element.classList.add('revealed')
        } else {
          // Remove class when out of view so animation re-triggers
          element.classList.remove('revealed')
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px'
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [options.threshold, options.rootMargin])

  return ref
}

// Hook that returns both ref and visibility state
export function useScrollRevealState(options = {}) {
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
