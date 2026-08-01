import { useEffect, useRef } from 'react'

export function useInfiniteScroll(
  onIntersect: () => void,
  rootMargin = '1500px',
) {
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onIntersect()
      },
      { rootMargin },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [onIntersect, rootMargin])

  return sentinelRef
}
