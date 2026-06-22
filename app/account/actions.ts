'use server'
import { requireUser } from '@/lib/auth/require-user'
import { createServerSupabase } from '@/lib/supabase/server'

export async function updateProfile(formData: FormData): Promise<{ error?: string }> {
  const user = await requireUser()
  const displayName = formData.get('displayName') as string | null
  const firstName = (formData.get('firstName') as string | null) || null
  const lastName = (formData.get('lastName') as string | null) || null
  const dateOfBirth = (formData.get('dateOfBirth') as string | null) || null
  const bio = (formData.get('bio') as string | null) || null
  const isAnonymous = formData.get('isAnonymous') === 'on'

  if (!displayName) {
    return { error: 'Display name is required' }
  }

  const supabase = createServerSupabase()
  const { error } = await supabase
    .from('profiles')
    .update({
      display_name: displayName,
      first_name: firstName,
      last_name: lastName,
      date_of_birth: dateOfBirth,
      bio,
      is_anonymous: isAnonymous,
    })
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }
  return {}
}
