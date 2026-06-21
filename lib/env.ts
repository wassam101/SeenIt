const REQUIRED_KEYS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'CF_STREAM_ACCOUNT_ID',
  'CF_STREAM_API_TOKEN',
  'NEXT_PUBLIC_MAPBOX_TOKEN',
] as const

type Env = {
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
  SUPABASE_SERVICE_ROLE_KEY: string
  CF_STREAM_ACCOUNT_ID: string
  CF_STREAM_API_TOKEN: string
  MAPBOX_TOKEN: string
}

export function getEnv(): Env {
  for (const key of REQUIRED_KEYS) {
    if (!process.env[key]) {
      throw new Error(`Missing required env var: ${key}`)
    }
  }
  return {
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    CF_STREAM_ACCOUNT_ID: process.env.CF_STREAM_ACCOUNT_ID!,
    CF_STREAM_API_TOKEN: process.env.CF_STREAM_API_TOKEN!,
    MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN!,
  }
}
