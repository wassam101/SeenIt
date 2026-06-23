import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/require-user'
import { createServerSupabase } from '@/lib/supabase/server'
import { publicDisplayName } from '@/lib/profile/public-name'

const LIKERS_LIMIT = 20

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const supabase = createServerSupabase()
  const { data, error } = await supabase
    .from('likes')
    .select('user_id, profiles(display_name, is_anonymous)')
    .eq('post_id', params.id)
    .order('created_at', { ascending: false })
    .limit(LIKERS_LIMIT)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const likers = (data ?? []).map((row: any) => ({ name: publicDisplayName(row.profiles) }))
  return NextResponse.json({ likers })
}

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const user = await requireUser()
  const supabase = createServerSupabase()
  const { error } = await supabase
    .from('likes')
    .upsert({ post_id: params.id, user_id: user.id }, { onConflict: 'post_id,user_id', ignoreDuplicates: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ liked: true })
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const user = await requireUser()
  const supabase = createServerSupabase()
  const { error } = await supabase.from('likes').delete().eq('post_id', params.id).eq('user_id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ liked: false })
}
