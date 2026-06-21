// app/post/new/page.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCurrentLocation } from '@/lib/location/use-current-location'

export default function NewPostPage() {
  const router = useRouter()
  const location = useCurrentLocation()
  const [error, setError] = useState<string | undefined>()
  const [uploading, setUploading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setUploading(true)
    const file = formData.get('video') as File
    const caption = String(formData.get('caption') ?? '')
    const locationLabel = String(formData.get('locationLabel') ?? '')

    try {
      const urlRes = await fetch('/api/videos/upload-url', { method: 'POST' })
      if (!urlRes.ok) throw new Error('Could not start upload')
      const { uploadUrl, videoId } = await urlRes.json()

      const uploadForm = new FormData()
      uploadForm.set('file', file)
      const uploadRes = await fetch(uploadUrl, { method: 'POST', body: uploadForm })
      if (!uploadRes.ok) throw new Error('Video upload failed, please try again')

      const postRes = await fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify({
          videoId,
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
    <form action={handleSubmit}>
      <h1>Post what you saw</h1>
      {error && (
        <p role="alert">
          {error} <button type="submit">Retry</button>
        </p>
      )}
      <label>
        Video
        <input name="video" type="file" accept="video/*" required />
      </label>
      <label>
        Caption
        <textarea name="caption" />
      </label>
      <label>
        Location
        <input name="locationLabel" placeholder="e.g. Main St & 5th" required />
      </label>
      <button type="submit" disabled={uploading}>
        {uploading ? 'Uploading…' : 'Post'}
      </button>
    </form>
  )
}
