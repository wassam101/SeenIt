// app/api/feed/route.ts
import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

const PAGE_SIZE = 20
const KM_PER_DEGREE_LAT = 111

export async function GET(request: Request) {
  const url = new URL(request.url)
  const mode = url.searchParams.get('mode') ?? 'global'
  const supabase = createServerSupabase()

  let query = supabase
    .from('posts')
    .select('id, caption, thumbnail_url, created_at, profiles!posts_author_id_fkey(display_name)')
    .eq('status', 'ready')
    .is('deleted_at', null)

  if (mode === 'nearby') {
    const latParam = url.searchParams.get('lat')
    const lngParam = url.searchParams.get('lng')
    const radiusKm = Number(url.searchParams.get('radiusKm') ?? '25')
    if (latParam === null || lngParam === null || Number.isNaN(Number(latParam)) || Number.isNaN(Number(lngParam))) {
      return NextResponse.json({ error: 'lat and lng are required for nearby mode' }, { status: 400 })
    }
    const lat = Number(latParam)
    const lng = Number(lngParam)
    const latDelta = radiusKm / KM_PER_DEGREE_LAT
    const lngDelta = radiusKm / (KM_PER_DEGREE_LAT * Math.cos((lat * Math.PI) / 180))
    query = query
      .gte('lat', lat - latDelta)
      .lte('lat', lat + latDelta)
      .gte('lng', lng - lngDelta)
      .lte('lng', lng + lngDelta)
  }

  const { data, error } = await query.order('created_at', { ascending: false }).limit(PAGE_SIZE)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const posts = (data ?? []).map((row: any) => ({
    id: row.id,
    authorName: row.profiles?.display_name ?? 'Unknown',
    thumbnailUrl: row.thumbnail_url,
    caption: row.caption,
    createdAt: row.created_at,
  }))

  const nextCursor = posts.length === PAGE_SIZE ? posts[posts.length - 1].createdAt : null
  return NextResponse.json({ posts, nextCursor })
}
