import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/require-user'
import { createServerSupabase } from '@/lib/supabase/server'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const user = await requireUser()
  const body = await request.json()

  if (!body.title || typeof body.title !== 'string') {
    return NextResponse.json({ error: 'title is required' }, { status: 400 })
  }
  if (body.type !== 'discussion' && body.type !== 'action') {
    return NextResponse.json({ error: "type must be 'discussion' or 'action'" }, { status: 400 })
  }
  if (body.type === 'action' && (!body.eventDatetime || !body.locationLabel)) {
    return NextResponse.json({ error: 'action events require eventDatetime and locationLabel' }, { status: 400 })
  }

  const supabase = createServerSupabase()
  const { data, error } = await supabase
    .from('events')
    .insert({
      post_id: params.id,
      organizer_id: user.id,
      title: body.title,
      description: body.description ?? null,
      type: body.type,
      event_datetime: body.eventDatetime ?? null,
      location_label: body.locationLabel ?? null,
    })
    .select('id, organizer_id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { error: memberError } = await supabase
    .from('event_members')
    .insert({ event_id: data.id, user_id: user.id })

  if (memberError) {
    return NextResponse.json({ error: memberError.message }, { status: 500 })
  }

  return NextResponse.json({ id: data.id, organizerId: data.organizer_id }, { status: 201 })
}
