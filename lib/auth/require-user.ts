import { createServerSupabase } from '@/lib/supabase/server'

export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized')
    this.name = 'UnauthorizedError'
  }
}

export async function requireUser(): Promise<{ id: string; email: string }> {
  const supabase = createServerSupabase()
  const { data } = await supabase.auth.getUser()
  if (!data.user) {
    throw new UnauthorizedError()
  }
  return { id: data.user.id, email: data.user.email! }
}
