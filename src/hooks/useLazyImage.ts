import { useEffect, useRef, useState } from 'react'

export function useLazyImage(src: string, rootMargin = '1000px') {
  const ref = useRef<HTMLImageElement | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const img = ref.current
    if (!img) return
    setLoaded(false)

    const handleComplete = () => setLoaded(true)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const target = entry.target as HTMLImageElement
          target.addEventListener('load', handleComplete, { once: true })
          target.addEventListener('error', handleComplete, { once: true })
          target.src = src
          if (target.complete) handleComplete()
          observer.unobserve(target)
        })
      },
      { rootMargin, threshold: 0.1 },
    )

    observer.observe(img)
    return () => {
      observer.disconnect()
      img.removeEventListener('load', handleComplete)
      img.removeEventListener('error', handleComplete)
    }
  }, [src, rootMargin])

  return { ref, loaded }
}
