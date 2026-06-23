// app/api/events/route.ts
import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/require-user'
import { createServerSupabase } from '@/lib/supabase/server'

export async function GET(_request: Request) {
  const user = await requireUser()
  const supabase = createServerSupabase()

  const { data: memberRows } = await supabase.from('event_members').select('event_id').eq('user_id', user.id)
  const joinedIds = (memberRows ?? []).map((row: any) => row.event_id)

  let query = supabase
    .from('events')
    .select('id, title, type, event_datetime, location_label, created_at')

  query = joinedIds.length > 0 ? query.or(`organizer_id.eq.${user.id},id.in.(${joinedIds.join(',')})`) : query.eq('organizer_id', user.id)

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const events = (data ?? []).map((row: any) => ({
    id: row.id,
    title: row.title,
    type: row.type,
    eventDatetime: row.event_datetime,
    locationLabel: row.location_label,
    createdAt: row.created_at,
  }))

  return NextResponse.json({ events })
}
