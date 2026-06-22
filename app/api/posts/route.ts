// app/api/posts/route.ts
import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/require-user'
import { createServerSupabase } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const user = await requireUser()
  const body = await request.json()

  const mediaType = body.mediaType === 'image' ? 'image' : 'video'

  if (mediaType === 'video' && (!body.videoId || typeof body.videoId !== 'string')) {
    return NextResponse.json({ error: 'videoId is required' }, { status: 400 })
  }
  if (mediaType === 'image' && (!body.imageUrl || typeof body.imageUrl !== 'string')) {
    return NextResponse.json({ error: 'imageUrl is required' }, { status: 400 })
  }

  const supabase = createServerSupabase()
  const { data, error } = await supabase
    .from('posts')
    .insert({
      author_id: user.id,
      media_type: mediaType,
      video_id: mediaType === 'video' ? body.videoId : null,
      image_url: mediaType === 'image' ? body.imageUrl : null,
      thumbnail_url: mediaType === 'image' ? body.imageUrl : null,
      caption: body.caption ?? null,
      lat: body.lat ?? null,
      lng: body.lng ?? null,
      location_label: body.locationLabel ?? null,
      status: mediaType === 'image' ? 'ready' : 'processing',
    })
    .select('id, status')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
