import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase/server'
import { AccountForm } from '@/components/AccountForm'

export default async function AccountPage() {
  const supabase = createServerSupabase()
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, first_name, last_name, date_of_birth, is_anonymous, bio, avatar_url')
    .eq('id', userData.user.id)
    .single()

  return (
    <div className="mx-auto max-w-sm px-4 py-10">
      <p className="font-mono text-[11px] uppercase tracking-wider text-slate mb-1">Account details</p>
      <h1 className="font-display font-bold text-2xl mb-6">Your profile</h1>
      <AccountForm initial={profile ?? {}} userId={userData.user.id} />
    </div>
  )
}
