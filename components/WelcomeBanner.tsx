'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { EyeIcon } from '@/components/icons/Eye'

export function WelcomeBanner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (searchParams.get('welcome') === '1') {
      setVisible(true)
      router.replace('/')
    }
  }, [searchParams, router])

  if (!visible) return null

  return (
    <div className="bg-teal text-paper">
      <div className="mx-auto max-w-2xl px-4 py-3 flex items-start gap-3">
        <EyeIcon open className="h-4 w-7 shrink-0 mt-0.5" />
        <p className="text-sm leading-snug">
          Your account has been created. SeenIt exists for one purpose: help you spot wrongdoing in your community
          and organize with others to advocate for it to get fixed.
        </p>
        <button
          onClick={() => setVisible(false)}
          aria-label="Dismiss"
          className="ml-auto shrink-0 text-paper/80 hover:text-paper"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
