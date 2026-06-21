// app/api/posts/route.ts
import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/require-user'
import { createServerSupabase } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const user = await requireUser()
  const body = await request.json()

  if (!body.videoId || typeof body.videoId !== 'string') {
    return NextResponse.json({ error: 'videoId is required' }, { status: 400 })
  }

  const supabase = createServerSupabase()
  const { data, error } = await supabase
    .from('posts')
    .insert({
      author_id: user.id,
      video_id: body.videoId,
      caption: body.caption ?? null,
      lat: body.lat ?? null,
      lng: body.lng ?? null,
      location_label: body.locationLabel ?? null,
      status: 'processing',
    })
    .select('id, status')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
