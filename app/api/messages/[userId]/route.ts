import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/require-user'
import { createServerSupabase } from '@/lib/supabase/server'

export async function GET(_request: Request, { params }: { params: { userId: string } }) {
  const user = await requireUser()
  const supabase = createServerSupabase()

  const { data, error } = await supabase
    .from('messages')
    .select('id, sender_id, recipient_id, body, created_at')
    .or(
      `and(sender_id.eq.${user.id},recipient_id.eq.${params.userId}),and(sender_id.eq.${params.userId},recipient_id.eq.${user.id})`
    )
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await supabase
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('sender_id', params.userId)
    .eq('recipient_id', user.id)
    .is('read_at', null)

  const messages = (data ?? []).map((row) => ({
    id: row.id,
    body: row.body,
    createdAt: row.created_at,
    fromMe: row.sender_id === user.id,
  }))

  return NextResponse.json({ messages })
}
