import { useMemo } from 'react'
import { ImageCard } from '@/components/ImageCard'

interface MasonryGridProps {
  urls: string[]
  columnCount: number
  onOpen: (url: string) => void
}

export function MasonryGrid({ urls, columnCount, onOpen }: MasonryGridProps) {
  const columns = useMemo(() => {
    const cols: string[][] = Array.from({ length: columnCount }, () => [])
    urls.forEach((url, index) => {
      cols[index % columnCount].push(url)
    })
    return cols
  }, [urls, columnCount])

  return (
    <div className="masonry-container">
      {columns.map((col, colIndex) => (
        <div key={colIndex} className="masonry-column">
          {col.map((url, rowIndex) => (
            <ImageCard key={`${url}-${colIndex}-${rowIndex}`} url={url} onOpen={onOpen} />
          ))}
        </div>
      ))}
    </div>
  )
}
