import { createServerClient } from '@supabase/ssr'
import { createClient as createRawClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { getEnv } from '@/lib/env'

export function createServerSupabase() {
  const env = getEnv()
  const cookieStore = cookies()
  return createServerClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options) {
        try {
          cookieStore.set(name, value, options)
        } catch {
          // Called from a Server Component during render, where cookies are read-only.
          // Safe to ignore: the session cookie is still set on the next Server Action/Route Handler call.
        }
      },
      remove(name: string, options) {
        try {
          cookieStore.set(name, '', { ...options, maxAge: 0 })
        } catch {
          // Called from a Server Component during render, where cookies are read-only.
        }
      },
    },
  })
}

export function createServiceSupabase() {
  const env = getEnv()
  return createRawClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
}
