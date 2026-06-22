// app/post/new/page.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCurrentLocation } from '@/lib/location/use-current-location'
import { createBrowserSupabase } from '@/lib/supabase/client'

export default function NewPostPage() {
  const router = useRouter()
  const location = useCurrentLocation()
  const [error, setError] = useState<string | undefined>()
  const [uploading, setUploading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setUploading(true)
    const file = formData.get('media') as File
    const caption = String(formData.get('caption') ?? '')
    const locationLabel = String(formData.get('locationLabel') ?? '')
    const isImage = file.type.startsWith('image/')

    try {
      let postBody: Record<string, unknown>

      if (isImage) {
        const supabase = createBrowserSupabase()
        const path = `${crypto.randomUUID()}-${file.name}`
        const { error: uploadError } = await supabase.storage.from('post-media').upload(path, file)
        if (uploadError) throw new Error('Photo upload failed, please try again')
        const { data } = supabase.storage.from('post-media').getPublicUrl(path)
        postBody = { mediaType: 'image', imageUrl: data.publicUrl }
      } else {
        const urlRes = await fetch('/api/videos/upload-url', { method: 'POST' })
        if (!urlRes.ok) throw new Error('Could not start upload')
        const { uploadUrl, videoId } = await urlRes.json()

        const uploadForm = new FormData()
        uploadForm.set('file', file)
        const uploadRes = await fetch(uploadUrl, { method: 'POST', body: uploadForm })
        if (!uploadRes.ok) throw new Error('Video upload failed, please try again')
        postBody = { mediaType: 'video', videoId }
      }

      const postRes = await fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify({
          ...postBody,
          caption,
          locationLabel,
          lat: location?.lat,
          lng: location?.lng,
        }),
      })
      if (!postRes.ok) throw new Error('Could not create post')
      const post = await postRes.json()
      router.push(`/post/${post.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setUploading(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-10">
      <p className="font-mono text-[11px] uppercase tracking-wider text-slate mb-1">File a witness report</p>
      <h1 className="font-display font-bold text-2xl mb-6">Post what you saw</h1>
      <form action={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <p role="alert" className="font-mono text-xs text-signal flex items-center gap-2">
            {error}
            <button type="submit" className="underline">
              Retry
            </button>
          </p>
        )}
        <label className="block">
          <span className="block font-mono text-[11px] uppercase tracking-wider text-slate mb-1">Photo or video</span>
          <input
            name="media"
            type="file"
            accept="image/*,video/*"
            required
            className="w-full border border-evidence bg-white px-3 py-2 text-sm file:font-mono file:text-xs file:uppercase file:mr-3 file:border-0 file:bg-teal file:text-paper file:px-2 file:py-1"
          />
        </label>
        <label className="block">
          <span className="block font-mono text-[11px] uppercase tracking-wider text-slate mb-1">Caption</span>
          <textarea name="caption" rows={3} className="w-full border border-evidence bg-white px-3 py-2 text-sm focus-visible:border-ink" />
        </label>
        <label className="block">
          <span className="block font-mono text-[11px] uppercase tracking-wider text-slate mb-1">Location</span>
          <input
            name="locationLabel"
            placeholder="e.g. Main St & 5th"
            required
            className="w-full border border-evidence bg-white px-3 py-2 text-sm focus-visible:border-ink"
          />
        </label>
        <button
          type="submit"
          disabled={uploading}
          className="font-mono text-xs uppercase tracking-wider px-4 py-2.5 bg-signal text-paper hover:bg-ink transition-colors disabled:opacity-50 disabled:cursor-default"
        >
          {uploading ? 'Uploading…' : 'Post'}
        </button>
      </form>
    </div>
  )
}
