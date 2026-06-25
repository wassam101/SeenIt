'use client'
import { useState } from 'react'
import { requestPasswordReset } from '../actions'

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | undefined>()
  const [sent, setSent] = useState(false)

  async function handleSubmit(formData: FormData) {
    setError(undefined)
    const result = await requestPasswordReset(formData)
    if (result.error) {
      setError(result.error)
      return
    }
    setSent(true)
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-10">
      <p className="font-mono text-[11px] uppercase tracking-wider text-slate mb-1">Reset your password</p>
      <h1 className="font-display font-bold text-2xl mb-6">Forgot password</h1>
      {sent ? (
        <p className="font-mono text-sm text-teal">
          If an account exists for that email, we&apos;ve sent a link to reset your password.
        </p>
      ) : (
        <form action={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <p role="alert" className="font-mono text-xs text-signal">
              {error}
            </p>
          )}
          <label className="block">
            <span className="block font-mono text-[11px] uppercase tracking-wider text-slate mb-1">Email</span>
            <input
              name="email"
              type="email"
              required
              className="w-full border border-evidence bg-paper px-3 py-2 text-sm focus-visible:border-ink"
            />
          </label>
          <button
            type="submit"
            className="font-mono text-xs uppercase tracking-wider px-4 py-2.5 bg-teal text-white hover:bg-signal active:bg-signal transition-colors"
          >
            Send reset link
          </button>
        </form>
      )}
    </div>
  )
}
