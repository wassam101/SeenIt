// app/api/posts/[id]/route.ts
import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/require-user'
import { createServerSupabase } from '@/lib/supabase/server'
import { publicDisplayName, publicAvatarUrl } from '@/lib/profile/public-name'

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const supabase = createServerSupabase()
  const { data: userData } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('posts')
    .select(
      'id, author_id, media_type, video_id, image_url, thumbnail_url, caption, lat, lng, location_label, status, created_at, profiles!posts_author_id_fkey(display_name, avatar_url, is_anonymous), likes(count), comments(count), reposts(count)'
    )
    .eq('id', params.id)
    .is('deleted_at', null)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }

  let saved = false
  if (userData.user) {
    const { data: saveRow } = await supabase
      .from('saves')
      .select('post_id')
      .eq('post_id', params.id)
      .eq('user_id', userData.user.id)
      .maybeSingle()
    saved = Boolean(saveRow)
  }

  return NextResponse.json({
    id: data.id,
    authorId: (data as any).profiles?.is_anonymous ? null : data.author_id,
    authorName: publicDisplayName((data as any).profiles),
    authorAvatarUrl: publicAvatarUrl((data as any).profiles),
    mediaType: (data as any).media_type ?? 'video',
    videoId: data.video_id,
    imageUrl: (data as any).image_url,
    thumbnailUrl: data.thumbnail_url,
    caption: data.caption,
    lat: data.lat,
    lng: data.lng,
    locationLabel: data.location_label,
    status: data.status,
    createdAt: data.created_at,
    likeCount: (data as any).likes?.[0]?.count ?? 0,
    commentCount: (data as any).comments?.[0]?.count ?? 0,
    repostCount: (data as any).reposts?.[0]?.count ?? 0,
    isOwnPost: Boolean(userData.user && userData.user.id === data.author_id),
    saved,
  })
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const user = await requireUser()
  const supabase = createServerSupabase()
  const { caption } = await request.json()

  const { error } = await supabase
    .from('posts')
    .update({ caption })
    .eq('id', params.id)
    .eq('author_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ caption })
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const user = await requireUser()
  const supabase = createServerSupabase()

  const { error } = await supabase
    .from('posts')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', params.id)
    .eq('author_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ deleted: true })
}
