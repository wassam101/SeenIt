'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signUp } from '../actions'

export default function SignupPage() {
  const router = useRouter()
  const [error, setError] = useState<string | undefined>()

  async function handleSubmit(formData: FormData) {
    const result = await signUp(formData)
    if (result.error) {
      setError(result.error)
      return
    }
    router.push('/')
  }

  return (
    <form action={handleSubmit}>
      <h1>Sign up</h1>
      {error && <p role="alert">{error}</p>}
      <label>
        Display name
        <input name="displayName" required />
      </label>
      <label>
        Email
        <input name="email" type="email" required />
      </label>
      <label>
        Password
        <input name="password" type="password" required minLength={8} />
      </label>
      <button type="submit">Create account</button>
    </form>
  )
}
