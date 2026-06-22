// app/api/posts/[id]/route.ts
import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { publicDisplayName, publicAvatarUrl } from '@/lib/profile/public-name'

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const supabase = createServerSupabase()
  const { data, error } = await supabase
    .from('posts')
    .select(
      'id, author_id, media_type, video_id, image_url, thumbnail_url, caption, lat, lng, location_label, status, created_at, profiles!posts_author_id_fkey(display_name, avatar_url, is_anonymous), likes(count), comments(count)'
    )
    .eq('id', params.id)
    .is('deleted_at', null)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
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
  })
}
