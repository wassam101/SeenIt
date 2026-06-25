import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/require-user'
import { createServerSupabase } from '@/lib/supabase/server'

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const user = await requireUser()
  const supabase = createServerSupabase()
  const { data } = await supabase
    .from('saves')
    .select('post_id')
    .eq('post_id', params.id)
    .eq('user_id', user.id)
    .maybeSingle()
  return NextResponse.json({ saved: Boolean(data) })
}

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const user = await requireUser()
  const supabase = createServerSupabase()
  const { error } = await supabase
    .from('saves')
    .upsert({ post_id: params.id, user_id: user.id }, { onConflict: 'post_id,user_id', ignoreDuplicates: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ saved: true })
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const user = await requireUser()
  const supabase = createServerSupabase()
  const { error } = await supabase.from('saves').delete().eq('post_id', params.id).eq('user_id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ saved: false })
}
