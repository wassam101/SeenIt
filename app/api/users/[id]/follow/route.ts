import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/require-user'
import { createServerSupabase } from '@/lib/supabase/server'

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const user = await requireUser()
  if (user.id === params.id) {
    return NextResponse.json({ error: 'You cannot follow yourself' }, { status: 400 })
  }

  const supabase = createServerSupabase()
  const { error } = await supabase
    .from('follows')
    .upsert({ follower_id: user.id, followed_id: params.id }, { onConflict: 'follower_id,followed_id', ignoreDuplicates: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ following: true })
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const user = await requireUser()
  const supabase = createServerSupabase()
  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower_id', user.id)
    .eq('followed_id', params.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ following: false })
}
