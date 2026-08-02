import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Copy, Download, X } from 'lucide-react'

interface LightboxProps {
  url: string
  onClose: () => void
}

const TOAST_DURATION = 3000
const TOAST_ROW_HEIGHT = 56
const TOAST_EXIT_DURATION = 300

interface ToastMessage {
  id: number
  text: string
  exiting: boolean
}

async function copyTextToClipboard(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text)
  }
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', 'readonly')
  textarea.style.position = 'fixed'
  textarea.style.top = '-9999px'
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()
  try {
    document.execCommand('copy')
  } finally {
    document.body.removeChild(textarea)
  }
}

const ACTION_BUTTON_CLASS = 'pointer-events-auto size-12 rounded-full border-transparent bg-white/90 text-black focus-visible:border-transparent focus-visible:ring-0 hover:bg-white hover:text-black'

export function Lightbox({ url, onClose }: LightboxProps) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const nextToastId = useRef(0)
  const toastTimers = useRef(new Set<number>())

  useEffect(() => {
    const timers = toastTimers.current
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
      timers.clear()
    }
  }, [])

  const addToast = useCallback((text: string) => {
    const toastId = ++nextToastId.current
    setToasts((current) => [...current, { id: toastId, text, exiting: false }])

    const exitTimer = window.setTimeout(() => {
      toastTimers.current.delete(exitTimer)
      setToasts((current) => current.map((toast) => (
        toast.id === toastId ? { ...toast, exiting: true } : toast
      )))

      const removeTimer = window.setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== toastId))
        toastTimers.current.delete(removeTimer)
      }, TOAST_EXIT_DURATION)
      toastTimers.current.add(removeTimer)
    }, TOAST_DURATION)
    toastTimers.current.add(exitTimer)
  }, [])

  const handleCopy = useCallback(async () => {
    try {
      await copyTextToClipboard(url)
      addToast('复制成功 !')
    } catch {
      // ignore copy failure
    }
  }, [addToast, url])

  const handleDownload = useCallback(async () => {
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error(`下载失败: HTTP ${response.status}`)
      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)
      const ext = url.split('?')[0].match(/\.(png|jpe?g|gif|webp|avif|bmp|ico)$/i)?.[1] ?? 'jpg'
      const link = document.createElement('a')
      link.href = objectUrl
      link.download = `image-${Date.now()}.${ext}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
      addToast('下载成功 !')
    } catch {
      window.open(url, '_blank', 'noopener')
      addToast('已打开原图 !')
    }
  }, [addToast, url])

  return (
    <Dialog
      open
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent
        className="flex w-fit max-w-[96vw] flex-col items-center justify-center gap-0 border-none bg-transparent p-0 ring-0"
        style={{
          pointerEvents: 'none',
        }}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>图片预览</DialogTitle>
          <DialogDescription>查看 ACG 图片</DialogDescription>
        </DialogHeader>

        <div className="relative select-none">
          <img
            key={url}
            src={url}
            alt="预览图片"
            draggable={false}
            className="pointer-events-auto max-h-[82vh] w-auto max-w-[94vw] animate-in zoom-in-90 fade-in-0 rounded-xl object-contain shadow-2xl duration-300 ease-out md:max-h-[92vh] md:max-w-[90vw]"
          />

          <Button
            size="icon-lg"
            aria-label="关闭"
            className="pointer-events-auto absolute -top-3 -right-3 z-10 size-10 rounded-full border-transparent bg-white/90 text-black shadow focus-visible:border-transparent focus-visible:ring-0 hover:bg-white hover:text-black"
            onClick={onClose}
          >
            <X className="size-5" />
          </Button>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="icon-lg"
              aria-label="复制链接"
              className={ACTION_BUTTON_CLASS}
              onClick={handleCopy}
            >
              <Copy className="size-5" />
            </Button>
            <Button
              size="icon-lg"
              aria-label="下载原图"
              className={ACTION_BUTTON_CLASS}
              onClick={handleDownload}
            >
              <Download className="size-5" />
            </Button>
          </div>
        </div>
      </DialogContent>

      {toasts.length > 0 && (
        <div
          aria-live="polite"
          className="pointer-events-none fixed right-4 bottom-4 z-[60] h-11 w-28"
        >
          {toasts.map((toast, index) => {
            const distanceFromNewest = toasts.length - index - 1
            const row = Math.min(distanceFromNewest, 2)
            const stackDepth = Math.min(Math.max(distanceFromNewest - 2, 0), 4)

            return (
              <div
                key={toast.id}
                className="absolute right-0 bottom-0 origin-bottom-right transition-[transform,opacity] duration-300 ease-out"
                style={{
                  opacity: 1 - stackDepth * 0.1,
                  transform: `translate(${stackDepth * 4}px, -${row * TOAST_ROW_HEIGHT}px) scale(${1 - stackDepth * 0.025})`,
                  zIndex: index + 1,
                }}
              >
                <div
                  role="status"
                  className={`flex w-max items-center rounded-lg bg-green-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg duration-300 ${toast.exiting ? 'animate-out fade-out-0 slide-out-to-right-8 zoom-out-95 ease-in' : 'animate-in fade-in-0 slide-in-from-right-6 ease-out'}`}
                >
                  {toast.text}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Dialog>
  )
}
