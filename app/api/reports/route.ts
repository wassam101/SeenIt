// app/api/reports/route.ts
import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/require-user'
import { createServerSupabase } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const user = await requireUser()
  const body = await request.json()

  if (body.targetType !== 'post' && body.targetType !== 'comment') {
    return NextResponse.json({ error: "targetType must be 'post' or 'comment'" }, { status: 400 })
  }
  if (!body.targetId || typeof body.targetId !== 'string') {
    return NextResponse.json({ error: 'targetId is required' }, { status: 400 })
  }
  if (!body.reason || typeof body.reason !== 'string') {
    return NextResponse.json({ error: 'reason is required' }, { status: 400 })
  }

  const supabase = createServerSupabase()
  const { data, error } = await supabase
    .from('reports')
    .insert({ target_type: body.targetType, target_id: body.targetId, reporter_id: user.id, reason: body.reason })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ id: data.id }, { status: 201 })
}
