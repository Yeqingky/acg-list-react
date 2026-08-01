import { useEffect, useState } from 'react'

function getColumnCount(width: number): number {
  if (width > 1200) return 4
  if (width > 800) return 3
  if (width > 500) return 2
  return 1
}

export function useColumnCount(): number {
  const [count, setCount] = useState(() => getColumnCount(window.innerWidth))

  useEffect(() => {
    const onResize = () => setCount(getColumnCount(window.innerWidth))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return count
}
