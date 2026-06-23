import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { publicDisplayName, publicAvatarUrl } from '@/lib/profile/public-name'

const PAGE_SIZE = 11

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const url = new URL(request.url)
  const cursor = url.searchParams.get('cursor')
  const supabase = createServerSupabase()

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_url, is_anonymous, bio')
    .eq('id', params.id)
    .single()

  if (profileError || !profile) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }

  const { count: postsCount } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('author_id', params.id)
    .eq('status', 'ready')
    .is('deleted_at', null)

  let postsQuery = supabase
    .from('posts')
    .select('id, caption, thumbnail_url, location_label, created_at')
    .eq('author_id', params.id)
    .eq('status', 'ready')
    .is('deleted_at', null)

  if (cursor) {
    postsQuery = postsQuery.lt('created_at', cursor)
  }

  const { data: postsData } = await postsQuery.order('created_at', { ascending: false }).limit(PAGE_SIZE)

  const { count: followerCount } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('followed_id', params.id)

  const { count: followingCount } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('follower_id', params.id)

  const { data: userData } = await supabase.auth.getUser()
  let isFollowing = false
  if (userData.user) {
    const { data: followRow } = await supabase
      .from('follows')
      .select('follower_id')
      .eq('follower_id', userData.user.id)
      .eq('followed_id', params.id)
      .maybeSingle()
    isFollowing = !!followRow
  }

  const name = publicDisplayName(profile)
  const avatarUrl = publicAvatarUrl(profile)
  const posts = (postsData ?? []).map((p: any) => ({
    id: p.id,
    authorName: name,
    authorAvatarUrl: avatarUrl,
    thumbnailUrl: p.thumbnail_url,
    caption: p.caption,
    locationLabel: p.location_label,
    createdAt: p.created_at,
  }))

  return NextResponse.json({
    id: profile.id,
    displayName: name,
    avatarUrl,
    bio: (profile as any).is_anonymous ? null : (profile as any).bio,
    followerCount: followerCount ?? 0,
    followingCount: followingCount ?? 0,
    isFollowing,
    isSelf: userData.user?.id === params.id,
    postsCount: postsCount ?? 0,
    posts,
    nextPostsCursor: posts.length === PAGE_SIZE ? posts[posts.length - 1].createdAt : null,
  })
}
