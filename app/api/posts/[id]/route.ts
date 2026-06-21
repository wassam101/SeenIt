// app/api/posts/[id]/route.ts
import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const supabase = createServerSupabase()
  const { data, error } = await supabase
    .from('posts')
    .select(
      'id, author_id, video_id, thumbnail_url, caption, lat, lng, location_label, status, created_at, profiles!posts_author_id_fkey(display_name), likes(count), comments(count)'
    )
    .eq('id', params.id)
    .is('deleted_at', null)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }

  return NextResponse.json({
    id: data.id,
    authorId: data.author_id,
    authorName: (data as any).profiles?.display_name ?? 'Unknown',
    videoId: data.video_id,
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
