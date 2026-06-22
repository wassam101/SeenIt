'use server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function signUp(formData: FormData): Promise<{ error?: string }> {
  const email = formData.get('email') as string | null
  const password = formData.get('password') as string | null
  const displayName = formData.get('displayName') as string | null
  if (!email || !password || !displayName) {
    return { error: 'Email, password, and display name are required' }
  }

  const supabase = createServerSupabase()
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error || !data.user) {
    return { error: error?.message ?? 'Sign up failed' }
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .insert({ id: data.user.id, display_name: displayName })
  if (profileError) {
    return { error: profileError.message }
  }

  return {}
}

export async function signIn(formData: FormData): Promise<{ error?: string }> {
  const email = formData.get('email') as string | null
  const password = formData.get('password') as string | null
  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const supabase = createServerSupabase()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    return { error: error.message }
  }
  return {}
}

export async function signOut(): Promise<void> {
  const supabase = createServerSupabase()
  await supabase.auth.signOut()
}
