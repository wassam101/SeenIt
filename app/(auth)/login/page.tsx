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
    <form action={handleSubmit}>
      <h1>Log in</h1>
      {error && <p role="alert">{error}</p>}
      <label>
        Email
        <input name="email" type="email" required />
      </label>
      <label>
        Password
        <input name="password" type="password" required />
      </label>
      <button type="submit">Log in</button>
    </form>
  )
}
