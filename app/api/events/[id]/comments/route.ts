// app/api/events/[id]/comments/route.ts
import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/require-user'
import { createServerSupabase } from '@/lib/supabase/server'
import { publicDisplayName, publicAvatarUrl } from '@/lib/profile/public-name'

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const supabase = createServerSupabase()
  const { data, error } = await supabase
    .from('comments')
    .select('id, body, created_at, author_id, profiles(display_name, avatar_url, is_anonymous)')
    .eq('event_id', params.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const comments = (data ?? []).map((row: any) => ({
    id: row.id,
    authorId: row.profiles?.is_anonymous ? null : row.author_id,
    authorName: publicDisplayName(row.profiles),
    authorAvatarUrl: publicAvatarUrl(row.profiles),
    body: row.body,
    createdAt: row.created_at,
  }))
  return NextResponse.json({ comments })
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const user = await requireUser()
  const body = await request.json()
  if (!body.body || typeof body.body !== 'string' || body.body.trim() === '') {
    return NextResponse.json({ error: 'body is required' }, { status: 400 })
  }

  const supabase = createServerSupabase()
  const { data, error } = await supabase
    .from('comments')
    .insert({ event_id: params.id, author_id: user.id, body: body.body })
    .select('id, body, created_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
