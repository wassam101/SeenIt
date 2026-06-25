'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserSupabase } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const supabase = createBrowserSupabase()
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true)
      }
    })
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  async function handleSubmit(formData: FormData) {
    setError(undefined)
    const password = formData.get('password') as string
    const supabase = createBrowserSupabase()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError(error.message)
      return
    }
    // The recovery session lives only in the browser client, not the
    // server-readable cookie session, so send them to log in fresh rather
    // than pretending they're already signed in on the next page.
    await supabase.auth.signOut()
    setSaved(true)
    setTimeout(() => router.push('/login'), 1500)
  }

  if (!ready) {
    return (
      <div className="mx-auto max-w-sm px-4 py-10">
        <p className="font-mono text-xs text-slate">Checking your reset link&hellip;</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-10">
      <p className="font-mono text-[11px] uppercase tracking-wider text-slate mb-1">Reset your password</p>
      <h1 className="font-display font-bold text-2xl mb-6">Choose a new password</h1>
      {saved ? (
        <p className="font-mono text-sm text-teal">Password updated. Log in with your new password&hellip;</p>
      ) : (
        <form action={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <p role="alert" className="font-mono text-xs text-signal">
              {error}
            </p>
          )}
          <label className="block">
            <span className="block font-mono text-[11px] uppercase tracking-wider text-slate mb-1">New password</span>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              className="w-full border border-evidence bg-paper px-3 py-2 text-sm focus-visible:border-ink"
            />
          </label>
          <button
            type="submit"
            className="font-mono text-xs uppercase tracking-wider px-4 py-2.5 bg-teal text-white hover:bg-signal active:bg-signal transition-colors"
          >
            Save new password
          </button>
        </form>
      )}
    </div>
  )
}
