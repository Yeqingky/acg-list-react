import { useCallback, useState } from 'react'
import { MasonryGrid } from '@/components/MasonryGrid'
import { Lightbox } from '@/components/Lightbox'
import { useColumnCount } from '@/hooks/useColumnCount'
import { useImageFeed } from '@/hooks/useImageFeed'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { Skeleton } from '@/components/ui/skeleton'

function LoadingGrid({ columnCount }: { columnCount: number }) {
  return (
    <div className="masonry-container">
      {Array.from({ length: columnCount }, (_, col) => (
        <div key={col} className="masonry-column">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-48 w-full rounded-lg md:h-64"
            />
          ))}
        </div>
      ))}
    </div>
  )
}

function App() {
  const { urls, loading, error, loadMore } = useImageFeed()
  const columnCount = useColumnCount()
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null)
  const sentinelRef = useInfiniteScroll(loadMore)

  const openLightbox = useCallback((url: string) => {
    setSelectedUrl(url)
  }, [])

  const closeLightbox = useCallback(() => {
    setSelectedUrl(null)
  }, [])

  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto max-w-[1400px] px-4 py-4">
        <header className="mb-4 flex items-center justify-between px-1">
          <h1 className="font-heading text-lg font-semibold tracking-tight">
            夜轻二次元图片瀑布流
          </h1>
          <a
            href="https://github.com/Yeqingky/acg-list-react"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            GitHub
          </a>
        </header>

        {loading ? (
          <LoadingGrid columnCount={columnCount} />
        ) : error ? (
          <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2 text-center text-muted-foreground">
            <p>图片加载失败,请稍后重试</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : (
          <>
            <MasonryGrid
              urls={urls}
              columnCount={columnCount}
              onOpen={openLightbox}
            />
            <div ref={sentinelRef} className="h-5 w-full" />
          </>
        )}
      </div>

      {selectedUrl && (
        <Lightbox
          url={selectedUrl}
          onClose={closeLightbox}
        />
      )}
    </main>
  )
}

export default App
