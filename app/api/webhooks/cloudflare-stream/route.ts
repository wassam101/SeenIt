import { NextResponse } from 'next/server'
import { createServiceSupabase } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const secret = request.headers.get('webhook-secret')
  if (secret !== process.env.CF_STREAM_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'invalid webhook secret' }, { status: 401 })
  }

  const body = await request.json()
  if (body.status?.state !== 'ready') {
    return NextResponse.json({ ignored: true }, { status: 200 })
  }

  const supabase = createServiceSupabase()
  const { error } = await supabase
    .from('posts')
    .update({ status: 'ready', thumbnail_url: body.thumbnail ?? null })
    .eq('video_id', body.uid)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
