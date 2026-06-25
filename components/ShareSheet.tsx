'use client'
import { useEffect, useRef, useState } from 'react'
import {
  LinkGlyphIcon,
  FacebookGlyphIcon,
  MessengerGlyphIcon,
  WhatsAppGlyphIcon,
  EmailGlyphIcon,
  ThreadsGlyphIcon,
  XGlyphIcon,
} from '@/components/icons/SharePlatforms'

function platforms(url: string, caption: string) {
  const encodedUrl = encodeURIComponent(url)
  const text = encodeURIComponent(caption)
  return [
    { label: 'Facebook', Icon: FacebookGlyphIcon, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: 'Messenger', Icon: MessengerGlyphIcon, href: `https://www.facebook.com/dialog/send?link=${encodedUrl}&redirect_uri=${encodedUrl}` },
    { label: 'WhatsApp', Icon: WhatsAppGlyphIcon, href: `https://wa.me/?text=${text}%20${encodedUrl}` },
    { label: 'Email', Icon: EmailGlyphIcon, href: `mailto:?subject=${text}&body=${encodedUrl}` },
    { label: 'Threads', Icon: ThreadsGlyphIcon, href: `https://www.threads.net/intent/post?text=${text}%20${encodedUrl}` },
    { label: 'X', Icon: XGlyphIcon, href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${text}` },
  ]
}

export function ShareSheet({ url, caption, onClose }: { url: string; caption: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false)
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sheetRef.current && !sheetRef.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  async function copyLink() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(onClose, 800)
  }

  return (
    <div className="fixed inset-0 z-30 flex items-end md:items-center justify-center bg-black/50" onClick={onClose}>
      <div
        ref={sheetRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full md:w-auto md:max-w-md bg-black text-white rounded-t-2xl md:rounded-2xl px-4 py-5"
      >
        <div className="flex items-center justify-between mb-4">
          <p className="font-display font-bold text-base">Share</p>
          <button onClick={onClose} aria-label="Close" className="text-white/60 hover:text-white transition-colors text-xl leading-none">
            &times;
          </button>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <button onClick={copyLink} className="flex flex-col items-center gap-1.5">
            <span className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
              <LinkGlyphIcon className="h-5 w-5" />
            </span>
            <span className="font-sans text-xs text-white/80 text-center">{copied ? 'Copied!' : 'Copy link'}</span>
          </button>
          {platforms(url, caption).map(({ label, Icon, href }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" onClick={onClose} className="flex flex-col items-center gap-1.5">
              <span className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                <Icon className="h-5 w-5" />
              </span>
              <span className="font-sans text-xs text-white/80 text-center">{label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
