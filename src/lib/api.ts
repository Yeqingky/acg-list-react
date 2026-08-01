const API_URLS = [
  'https://api.yppp.net/pc.php?return=all',
  'https://api.yppp.net/pe.php?return=all',
]

export function shuffle<T>(list: T[]): T[] {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export async function fetchImageUrls(): Promise<string[]> {
  const texts = await Promise.all(API_URLS.map(async (url) => {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`图片接口请求失败: HTTP ${response.status}`)
    }
    return response.text()
  }))
  const urls = texts
    .flatMap((text) => text.split('\n'))
    .map((url) => url.trim())
    .filter((url) => url.length > 0)
  return shuffle([...new Set(urls)])
}
