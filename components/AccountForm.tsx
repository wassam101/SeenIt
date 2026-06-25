'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateProfile } from '@/app/account/actions'
import { createBrowserSupabase } from '@/lib/supabase/client'
import { Avatar } from '@/components/Avatar'

type Profile = {
  display_name?: string | null
  first_name?: string | null
  last_name?: string | null
  date_of_birth?: string | null
  is_anonymous?: boolean | null
  bio?: string | null
  avatar_url?: string | null
}

export function AccountForm({ initial, userId }: { initial: Profile; userId: string }) {
  const router = useRouter()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initial.avatar_url ?? null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [saved, setSaved] = useState(false)

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(undefined)
    try {
      const supabase = createBrowserSupabase()
      const path = `${userId}/${crypto.randomUUID()}-${file.name}`
      const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
      if (uploadError) throw new Error('Photo upload failed, please try again')
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      const { error: updateError } = await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', userId)
      if (updateError) throw new Error(updateError.message)
      setAvatarUrl(data.publicUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(formData: FormData) {
    setSaved(false)
    setError(undefined)
    const result = await updateProfile(formData)
    if (result.error) {
      setError(result.error)
      return
    }
    setSaved(true)
    router.refresh()
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <p role="alert" className="font-sans text-sm text-signal">
          {error}
        </p>
      )}
      {saved && <p className="font-sans text-sm text-teal">Saved.</p>}

      <div className="flex items-center gap-3">
        <Avatar name={initial.display_name ?? '?'} avatarUrl={avatarUrl} size={56} />
        <label className="font-sans text-sm font-semibold text-teal hover:text-signal transition-colors cursor-pointer">
          {uploading ? 'Uploading…' : 'Change photo'}
          <input type="file" accept="image/*" className="sr-only" onChange={handleAvatarChange} disabled={uploading} />
        </label>
      </div>

      <label className="block">
        <span className="block font-sans text-sm text-slate mb-1">Display name</span>
        <input
          name="displayName"
          defaultValue={initial.display_name ?? ''}
          required
          className="w-full border border-evidence bg-paper px-3 py-2 text-sm focus-visible:border-ink"
        />
      </label>

      <div className="flex gap-3">
        <label className="block flex-1">
          <span className="block font-sans text-sm text-slate mb-1">First name</span>
          <input
            name="firstName"
            defaultValue={initial.first_name ?? ''}
            className="w-full border border-evidence bg-paper px-3 py-2 text-sm focus-visible:border-ink"
          />
        </label>
        <label className="block flex-1">
          <span className="block font-sans text-sm text-slate mb-1">Last name</span>
          <input
            name="lastName"
            defaultValue={initial.last_name ?? ''}
            className="w-full border border-evidence bg-paper px-3 py-2 text-sm focus-visible:border-ink"
          />
        </label>
      </div>

      <label className="block">
        <span className="block font-sans text-sm text-slate mb-1">Date of birth</span>
        <input
          name="dateOfBirth"
          type="date"
          defaultValue={initial.date_of_birth ?? ''}
          className="w-full border border-evidence bg-paper px-3 py-2 text-sm focus-visible:border-ink"
        />
      </label>

      <label className="block">
        <span className="block font-sans text-sm text-slate mb-1">Bio</span>
        <textarea
          name="bio"
          rows={3}
          defaultValue={initial.bio ?? ''}
          className="w-full border border-evidence bg-paper px-3 py-2 text-sm focus-visible:border-ink"
        />
      </label>

      <label className="flex items-center gap-2 font-sans text-sm text-slate">
        <input type="checkbox" name="isAnonymous" defaultChecked={initial.is_anonymous ?? false} />
        Post and comment anonymously instead of showing my name
      </label>

      <button
        type="submit"
        className="font-sans text-sm font-semibold rounded-full px-4 py-2.5 bg-teal text-white hover:bg-signal active:bg-signal transition-colors"
      >
        Save changes
      </button>
    </form>
  )
}
