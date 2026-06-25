import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/require-user'
import { createServerSupabase } from '@/lib/supabase/server'

export async function GET() {
  const user = await requireUser()
  const supabase = createServerSupabase()

  const { data, error } = await supabase
    .from('messages')
    .select(
      'id, sender_id, recipient_id, body, created_at, read_at, sender:profiles!messages_sender_id_fkey(display_name, avatar_url), recipient:profiles!messages_recipient_id_fkey(display_name, avatar_url)'
    )
    .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const seen = new Set<string>()
  const conversations = []
  for (const row of (data ?? []) as any[]) {
    const isSender = row.sender_id === user.id
    const counterpartId = isSender ? row.recipient_id : row.sender_id
    if (seen.has(counterpartId)) continue
    seen.add(counterpartId)
    const counterpart = isSender ? row.recipient : row.sender
    conversations.push({
      userId: counterpartId,
      displayName: counterpart?.display_name ?? 'Unknown',
      avatarUrl: counterpart?.avatar_url ?? null,
      lastMessage: row.body,
      lastMessageAt: row.created_at,
      unread: !isSender && !row.read_at,
    })
  }

  return NextResponse.json({ conversations })
}

export async function POST(request: Request) {
  const user = await requireUser()
  const { recipientId, body } = await request.json()

  if (!recipientId || !body?.trim()) {
    return NextResponse.json({ error: 'recipientId and body are required' }, { status: 400 })
  }
  if (recipientId === user.id) {
    return NextResponse.json({ error: 'You cannot message yourself' }, { status: 400 })
  }

  const supabase = createServerSupabase()
  const { data, error } = await supabase
    .from('messages')
    .insert({ sender_id: user.id, recipient_id: recipientId, body: body.trim() })
    .select('id, sender_id, recipient_id, body, created_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
