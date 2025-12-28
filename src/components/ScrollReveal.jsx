import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const ScrollReveal = ({ 
  children, 
  className = '',
  animation = 'fadeUp', // fadeUp, fadeIn, slideLeft, slideRight, scale
  delay = 0,
  duration = 0.8,
  threshold = 0.1,
  once = true
}) => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Set initial state
    const animations = {
      fadeUp: { y: 50, opacity: 0 },
      fadeIn: { opacity: 0 },
      slideLeft: { x: -50, opacity: 0 },
      slideRight: { x: 50, opacity: 0 },
      scale: { scale: 0.8, opacity: 0 }
    };

    gsap.set(element, animations[animation] || animations.fadeUp);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(element, {
              y: 0,
              x: 0,
              scale: 1,
              opacity: 1,
              duration,
              delay,
              ease: 'power3.out'
            });
            if (once) {
              observer.unobserve(element);
            }
          }
        });
      },
      { threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [animation, delay, duration, threshold, once]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default ScrollReveal;
