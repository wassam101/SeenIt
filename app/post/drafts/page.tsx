'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { listDrafts, deleteDraft, type Draft } from '@/lib/drafts'

export default function DraftsPage() {
  const router = useRouter()
  const [drafts, setDrafts] = useState<Draft[] | null>(null)
  const [retryingId, setRetryingId] = useState<string | null>(null)
  const [error, setError] = useState<string | undefined>()

  useEffect(() => {
    listDrafts().then(setDrafts)
  }, [])

  async function retry(draft: Draft) {
    setError(undefined)
    setRetryingId(draft.id)
    try {
      const urlRes = await fetch('/api/videos/upload-url', { method: 'POST' })
      if (!urlRes.ok) throw new Error('Could not start upload')
      const { uploadUrl, videoId } = await urlRes.json()

      const uploadForm = new FormData()
      uploadForm.set('file', draft.blob, 'recording.webm')
      const uploadRes = await fetch(uploadUrl, { method: 'POST', body: uploadForm })
      if (!uploadRes.ok) throw new Error('Video upload failed')

      const postRes = await fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify({
          mediaType: 'video',
          videoId,
          caption: draft.caption,
          locationLabel: draft.locationLabel,
          lat: draft.lat,
          lng: draft.lng,
        }),
      })
      if (!postRes.ok) throw new Error('Could not create post')

      await deleteDraft(draft.id)
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Still could not upload, please try again later')
      setRetryingId(null)
    }
  }

  async function remove(id: string) {
    await deleteDraft(id)
    setDrafts((prev) => prev?.filter((d) => d.id !== id) ?? null)
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-10">
      <p className="font-mono text-[11px] uppercase tracking-wider text-slate mb-1">Saved on this device</p>
      <h1 className="font-display font-bold text-2xl mb-6">Drafts</h1>
      {error && (
        <p role="alert" className="font-mono text-xs text-signal mb-4">
          {error}
        </p>
      )}
      {drafts === null ? (
        <p className="font-mono text-xs text-slate">Loading&hellip;</p>
      ) : drafts.length === 0 ? (
        <p className="font-mono text-xs text-slate border border-dashed border-evidence px-3 py-6 text-center">
          No drafts. Recordings that couldn&apos;t upload will show up here.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {drafts.map((draft) => (
            <li key={draft.id} className="border border-evidence bg-white p-3">
              <video src={URL.createObjectURL(draft.blob)} controls className="w-full max-h-48 mb-2" />
              <p className="font-display font-bold text-sm leading-snug">{draft.caption || 'No caption'}</p>
              {draft.locationLabel && <p className="font-mono text-xs text-slate mt-1">{draft.locationLabel}</p>}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => retry(draft)}
                  disabled={retryingId === draft.id}
                  className="font-mono text-xs uppercase tracking-wider px-3 py-1.5 bg-teal text-paper hover:bg-signal transition-colors disabled:opacity-50"
                >
                  {retryingId === draft.id ? 'Uploading…' : 'Retry upload'}
                </button>
                <button
                  onClick={() => remove(draft.id)}
                  className="font-mono text-xs uppercase tracking-wider px-3 py-1.5 text-slate hover:text-signal transition-colors"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
