import { useCallback, useRef } from 'react'
import { useLazyImage } from '@/hooks/useLazyImage'

interface ImageCardProps {
  url: string
  onOpen: (url: string) => void
}

export function ImageCard({ url, onOpen }: ImageCardProps) {
  const { ref, loaded } = useLazyImage(url)
  const glowRef = useRef<HTMLDivElement | null>(null)

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    const glow = glowRef.current
    if (!glow) return
    const rect = event.currentTarget.getBoundingClientRect()
    glow.style.left = `${event.clientX - rect.left}px`
    glow.style.top = `${event.clientY - rect.top}px`
  }, [])

  return (
    <button
      type="button"
      aria-label="查看大图"
      className="image-card"
      onMouseMove={handleMouseMove}
      onClick={() => onOpen(url)}
    >
      <div ref={glowRef} className="image-glow" />
      <img
        ref={ref}
        alt="ACG 图片"
        className={loaded ? 'image-loaded' : undefined}
        draggable={false}
      />
    </button>
  )
}
