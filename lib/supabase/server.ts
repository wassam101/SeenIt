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
        cookieStore.set(name, value, options)
      },
      remove(name: string, options) {
        cookieStore.set(name, '', { ...options, maxAge: 0 })
      },
    },
  })
}

export function createServiceSupabase() {
  const env = getEnv()
  return createRawClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
}
