// lib/video/cloudflare-stream.ts
import { getEnv } from '@/lib/env'

export async function createStreamUploadUrl(): Promise<{ uploadUrl: string; videoId: string }> {
  const env = getEnv()
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${env.CF_STREAM_ACCOUNT_ID}/stream/direct_upload`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.CF_STREAM_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ maxDurationSeconds: 120 }),
    }
  )

  if (!response.ok) {
    throw new Error(`Cloudflare Stream request failed with status ${response.status}`)
  }

  const data = await response.json()
  return { uploadUrl: data.result.uploadURL, videoId: data.result.uid }
}
