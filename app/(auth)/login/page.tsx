'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from '../actions'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | undefined>()

  async function handleSubmit(formData: FormData) {
    const result = await signIn(formData)
    if (result.error) {
      setError(result.error)
      return
    }
    router.push('/')
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-10">
      <p className="font-mono text-[11px] uppercase tracking-wider text-slate mb-1">Welcome back</p>
      <h1 className="font-display font-bold text-2xl mb-6">Log in</h1>
      <form action={handleSubmit} className="flex flex-col gap-4">
        {error && <p role="alert" className="font-mono text-xs text-signal">{error}</p>}
        <label className="block">
          <span className="block font-mono text-[11px] uppercase tracking-wider text-slate mb-1">Email</span>
          <input name="email" type="email" required className="w-full border border-evidence bg-white px-3 py-2 text-sm focus-visible:border-ink" />
        </label>
        <label className="block">
          <span className="block font-mono text-[11px] uppercase tracking-wider text-slate mb-1">Password</span>
          <input name="password" type="password" required className="w-full border border-evidence bg-white px-3 py-2 text-sm focus-visible:border-ink" />
        </label>
        <button
          type="submit"
          className="font-mono text-xs uppercase tracking-wider px-4 py-2.5 bg-ink text-paper hover:bg-signal transition-colors"
        >
          Log in
        </button>
      </form>
    </div>
  )
}
