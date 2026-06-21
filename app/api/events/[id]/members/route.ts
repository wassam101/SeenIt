import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/require-user'
import { createServerSupabase } from '@/lib/supabase/server'

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const supabase = createServerSupabase()
  const { data, error } = await supabase
    .from('event_members')
    .select('user_id, joined_at, profiles(display_name)')
    .eq('event_id', params.id)
    .order('joined_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const members = (data ?? []).map((row: any) => ({
    userId: row.user_id,
    displayName: row.profiles?.display_name ?? 'Unknown',
    joinedAt: row.joined_at,
  }))
  return NextResponse.json({ members })
}

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const user = await requireUser()
  const supabase = createServerSupabase()
  const { error } = await supabase
    .from('event_members')
    .upsert({ event_id: params.id, user_id: user.id }, { onConflict: 'event_id,user_id', ignoreDuplicates: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ joined: true })
}
