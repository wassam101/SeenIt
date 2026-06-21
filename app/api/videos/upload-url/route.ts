// app/api/videos/upload-url/route.ts
import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/require-user'
import { createStreamUploadUrl } from '@/lib/video/cloudflare-stream'

export async function POST() {
  await requireUser()
  const { uploadUrl, videoId } = await createStreamUploadUrl()
  return NextResponse.json({ uploadUrl, videoId })
}
