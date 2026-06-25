// app/post/new/page.tsx
'use client'
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCurrentLocation } from '@/lib/location/use-current-location'
import { reverseGeocode } from '@/lib/location/reverse-geocode'
import { searchAddress, type AddressSuggestion } from '@/lib/location/search-address'
import { createBrowserSupabase } from '@/lib/supabase/client'
import { saveDraft } from '@/lib/drafts'

const ADDRESS_SEARCH_DEBOUNCE_MS = 350

export default function NewPostPage() {
  const router = useRouter()
  const location = useCurrentLocation()
  const [error, setError] = useState<string | undefined>()
  const [uploading, setUploading] = useState(false)
  const [locatingLabel, setLocatingLabel] = useState(false)
  const [locationLabel, setLocationLabel] = useState('')
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [preview, setPreview] = useState<{ kind: 'image' | 'video'; url: string; name: string } | null>(null)
  const [mediaFile, setMediaFile] = useState<File | Blob | null>(null)
  const [recording, setRecording] = useState(false)
  const [recordedVideoId, setRecordedVideoId] = useState<string | null>(null)
  const [recordedUploadStatus, setRecordedUploadStatus] = useState<'idle' | 'uploading' | 'uploaded' | 'failed'>('idle')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const captionRef = useRef<HTMLTextAreaElement>(null)
  const videoPreviewRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const searchTimerRef = useRef<ReturnType<typeof setTimeout>>()

  function handleLocationInput(value: string) {
    setLocationLabel(value)
    setSelectedCoords(null)
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    if (!value.trim()) {
      setSuggestions([])
      return
    }
    searchTimerRef.current = setTimeout(async () => {
      setSuggestions(await searchAddress(value))
    }, ADDRESS_SEARCH_DEBOUNCE_MS)
  }

  function selectSuggestion(suggestion: AddressSuggestion) {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    setLocationLabel(suggestion.label)
    setSelectedCoords({ lat: suggestion.lat, lng: suggestion.lng })
    setSuggestions([])
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) {
      setPreview(null)
      setMediaFile(null)
      return
    }
    const kind = file.type.startsWith('image/') ? 'image' : 'video'
    setPreview({ kind, url: URL.createObjectURL(file), name: file.name })
    setMediaFile(file)
    setRecordedVideoId(null)
    setRecordedUploadStatus('idle')
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      streamRef.current = stream
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream
      }
      recordedChunksRef.current = []
      const recorder = new MediaRecorder(stream)
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data)
      }
      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' })
        streamRef.current?.getTracks().forEach((track) => track.stop())
        setPreview({ kind: 'video', url: URL.createObjectURL(blob), name: 'Recorded video' })
        setMediaFile(blob)
        uploadRecordedVideo(blob)
      }
      mediaRecorderRef.current = recorder
      recorder.start()
      setRecording(true)
      setRecordedVideoId(null)
      setRecordedUploadStatus('idle')
      setError(undefined)
    } catch {
      setError('Could not access your camera or microphone')
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop()
    setRecording(false)
  }

  async function uploadRecordedVideo(blob: Blob) {
    setRecordedUploadStatus('uploading')
    try {
      const urlRes = await fetch('/api/videos/upload-url', { method: 'POST' })
      if (!urlRes.ok) throw new Error('Could not start upload')
      const { uploadUrl, videoId } = await urlRes.json()
      const uploadForm = new FormData()
      uploadForm.set('file', blob, 'recording.webm')
      const uploadRes = await fetch(uploadUrl, { method: 'POST', body: uploadForm })
      if (!uploadRes.ok) throw new Error('Video upload failed')
      setRecordedVideoId(videoId)
      setRecordedUploadStatus('uploaded')
    } catch {
      setRecordedUploadStatus('failed')
      await saveDraft({
        id: crypto.randomUUID(),
        blob,
        caption: captionRef.current?.value ?? '',
        locationLabel,
        lat: selectedCoords?.lat ?? location?.lat,
        lng: selectedCoords?.lng ?? location?.lng,
        createdAt: new Date().toISOString(),
      })
      setError('Could not upload your recording — saved to Drafts so you can retry later.')
    }
  }

  async function shareMyLocation() {
    if (!navigator.geolocation) {
      setError('Your device does not support sharing location')
      return
    }
    setLocatingLabel(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        const place = await reverseGeocode(latitude, longitude)
        setLocationLabel(place ?? `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`)
        setSelectedCoords({ lat: latitude, lng: longitude })
        setSuggestions([])
        setLocatingLabel(false)
      },
      () => {
        setError('Could not get your location, please enter it manually')
        setLocatingLabel(false)
      }
    )
  }

  async function handleSubmit(formData: FormData) {
    if (!mediaFile) {
      setError('Choose a photo or video, or record one')
      return
    }
    if (recordedUploadStatus === 'uploading') {
      setError('Still uploading your recording — wait a moment and try again')
      return
    }
    setUploading(true)
    const caption = String(formData.get('caption') ?? '')

    try {
      let postBody: Record<string, unknown>

      if (recordedVideoId && recordedUploadStatus === 'uploaded') {
        postBody = { mediaType: 'video', videoId: recordedVideoId }
      } else if (mediaFile.type.startsWith('image/')) {
        const supabase = createBrowserSupabase()
        const name = mediaFile instanceof File ? mediaFile.name : 'photo.jpg'
        const path = `${crypto.randomUUID()}-${name}`
        const { error: uploadError } = await supabase.storage.from('post-media').upload(path, mediaFile)
        if (uploadError) throw new Error('Photo upload failed, please try again')
        const { data } = supabase.storage.from('post-media').getPublicUrl(path)
        postBody = { mediaType: 'image', imageUrl: data.publicUrl }
      } else {
        const urlRes = await fetch('/api/videos/upload-url', { method: 'POST' })
        if (!urlRes.ok) throw new Error('Could not start upload')
        const { uploadUrl, videoId } = await urlRes.json()

        const uploadForm = new FormData()
        uploadForm.set('file', mediaFile)
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
          lat: selectedCoords?.lat ?? location?.lat,
          lng: selectedCoords?.lng ?? location?.lng,
        }),
      })
      if (!postRes.ok) throw new Error('Could not create post')
      await postRes.json()
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setUploading(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-10">
      <p className="font-mono text-[11px] uppercase tracking-wider text-slate mb-1">SeenIt</p>
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
        <div>
          <span className="block font-mono text-[11px] uppercase tracking-wider text-slate mb-1">Photo or video</span>
          <input
            ref={fileInputRef}
            id="media-input"
            name="media"
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="sr-only"
          />
          <div className="flex flex-wrap gap-2">
            <label
              htmlFor="media-input"
              className="inline-block cursor-pointer font-mono text-xs uppercase tracking-wider bg-teal text-white px-3 py-2 hover:bg-signal transition-colors"
            >
              Choose photo or video
            </label>
            <button
              type="button"
              onClick={recording ? stopRecording : startRecording}
              className="font-mono text-xs uppercase tracking-wider px-3 py-2 border border-teal text-teal hover:border-signal hover:text-signal transition-colors"
            >
              {recording ? 'Stop recording' : 'Record video'}
            </button>
          </div>
          {recording && (
            <video ref={videoPreviewRef} autoPlay muted playsInline className="w-full max-h-48 mt-3 bg-black" />
          )}
          {recordedUploadStatus === 'uploading' && (
            <p className="font-mono text-[11px] text-slate mt-2">Uploading your recording&hellip;</p>
          )}
          {recordedUploadStatus === 'uploaded' && (
            <p className="font-mono text-[11px] text-teal mt-2">Recording uploaded.</p>
          )}
          {preview && (
            <div className="mt-3 border border-evidence bg-paper p-2">
              {preview.kind === 'image' ? (
                <img src={preview.url} alt="Selected preview" className="w-full max-h-48 object-cover" />
              ) : (
                <video src={preview.url} controls className="w-full max-h-48" />
              )}
              <p className="font-mono text-[11px] text-slate mt-1 truncate">{preview.name}</p>
            </div>
          )}
        </div>
        <label className="block">
          <span className="block font-mono text-[11px] uppercase tracking-wider text-slate mb-1">Caption</span>
          <textarea
            ref={captionRef}
            name="caption"
            rows={3}
            className="w-full border border-evidence bg-paper px-3 py-2 text-sm focus-visible:border-ink"
          />
        </label>
        <div className="relative">
          <span className="block font-mono text-[11px] uppercase tracking-wider text-slate mb-1">SeenIt at</span>
          <div className="flex gap-2">
            <input
              name="locationLabel"
              value={locationLabel}
              onChange={(e) => handleLocationInput(e.target.value)}
              placeholder="e.g. Starbucks, 6030 Main St W, Milton, ON"
              autoComplete="off"
              required
              className="flex-1 border border-evidence bg-paper px-3 py-2 text-sm focus-visible:border-ink"
            />
            <button
              type="button"
              onClick={shareMyLocation}
              disabled={locatingLabel}
              className="font-mono text-[11px] uppercase tracking-wider px-3 py-2 text-teal hover:text-signal transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {locatingLabel ? 'Locating…' : 'Share my location'}
            </button>
          </div>
          {suggestions.length > 0 && (
            <ul className="absolute left-0 top-full mt-1 z-10 w-full bg-paper border border-ink shadow-sm max-h-56 overflow-auto">
              {suggestions.map((suggestion, i) => (
                <li key={`${suggestion.label}-${i}`}>
                  <button
                    type="button"
                    onClick={() => selectSuggestion(suggestion)}
                    className="w-full text-left font-mono text-xs px-3 py-2 hover:bg-paper transition-colors"
                  >
                    {suggestion.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          type="submit"
          disabled={uploading}
          className="font-mono text-xs uppercase tracking-wider px-4 py-2.5 bg-teal text-white hover:bg-signal active:bg-signal transition-colors disabled:opacity-50 disabled:cursor-default"
        >
          {uploading ? 'Uploading…' : 'Post'}
        </button>
        <Link
          href="/post/drafts"
          className="text-center font-mono text-xs uppercase tracking-wider text-slate hover:text-teal transition-colors"
        >
          Drafts
        </Link>
      </form>
    </div>
  )
}
