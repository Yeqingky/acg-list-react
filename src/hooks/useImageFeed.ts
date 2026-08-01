import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchImageUrls, shuffle } from '@/lib/api'

const BATCH_SIZE = 24

export function useImageFeed() {
  const [urls, setUrls] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const sourceRef = useRef<string[]>([])
  const nextIndexRef = useRef(0)

  useEffect(() => {
    let cancelled = false

    fetchImageUrls()
      .then((list) => {
        if (cancelled) return
        sourceRef.current = list
        nextIndexRef.current = Math.min(BATCH_SIZE, list.length)
        setUrls(list.slice(0, BATCH_SIZE))
        setLoading(false)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : String(err))
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const loadMore = useCallback(() => {
    setUrls((current) => {
      let source = sourceRef.current
      if (source.length === 0) return current

      if (nextIndexRef.current >= source.length) {
        source = shuffle(source)
        sourceRef.current = source
        nextIndexRef.current = 0
      }

      const nextBatch = source.slice(
        nextIndexRef.current,
        nextIndexRef.current + BATCH_SIZE,
      )
      nextIndexRef.current += nextBatch.length
      return [...current, ...nextBatch]
    })
  }, [])

  return { urls, loading, error, loadMore }
}
