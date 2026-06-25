import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/require-user'
import { createServerSupabase } from '@/lib/supabase/server'
import { publicDisplayName, publicAvatarUrl } from '@/lib/profile/public-name'

export async function GET() {
  const user = await requireUser()
  const supabase = createServerSupabase()

  const { data, error } = await supabase
    .from('saves')
    .select(
      'created_at, posts!inner(id, author_id, caption, thumbnail_url, location_label, created_at, deleted_at, profiles!posts_author_id_fkey(display_name, avatar_url, is_anonymous))'
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const posts = (data ?? [])
    .filter((row: any) => row.posts && !row.posts.deleted_at)
    .map((row: any) => ({
      id: row.posts.id,
      authorId: row.posts.profiles?.is_anonymous ? null : row.posts.author_id,
      authorName: publicDisplayName(row.posts.profiles),
      authorAvatarUrl: publicAvatarUrl(row.posts.profiles),
      thumbnailUrl: row.posts.thumbnail_url,
      caption: row.posts.caption,
      locationLabel: row.posts.location_label,
      createdAt: row.posts.created_at,
    }))

  return NextResponse.json({ posts })
}
