'use client'
import { useState } from 'react'
import { PaperPlaneIcon } from '@/components/icons/PaperPlane'
import { ShareSheet } from '@/components/ShareSheet'

export function ShareButton({ caption }: { postId: string; caption?: string | null }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Share"
        className="flex items-center rounded-full px-2 py-1 -mx-2 -my-1 text-slate hover:text-teal hover:bg-teal/10 transition-colors"
      >
        <PaperPlaneIcon className="h-[22px] w-[22px]" />
      </button>
      {open && (
        <ShareSheet
          url={typeof window !== 'undefined' ? window.location.href : ''}
          caption={caption ?? ''}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
