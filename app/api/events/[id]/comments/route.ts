// app/api/events/[id]/comments/route.ts
import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/require-user'
import { createServerSupabase } from '@/lib/supabase/server'

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const supabase = createServerSupabase()
  const { data, error } = await supabase
    .from('comments')
    .select('id, body, created_at, profiles(display_name)')
    .eq('event_id', params.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const comments = (data ?? []).map((row: any) => ({
    id: row.id,
    authorName: row.profiles?.display_name ?? 'Unknown',
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
