import Link from 'next/link'
import { EyeLogo } from '@/components/icons/Logo'
import { createServerSupabase } from '@/lib/supabase/server'
import { LandingPostsOrbit } from '@/components/LandingPostsOrbit'

async function getLatestThumbnails() {
  const supabase = createServerSupabase()
  const { data } = await supabase
    .from('posts')
    .select('id, thumbnail_url, caption')
    .eq('status', 'ready')
    .not('thumbnail_url', 'is', null)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(11)

  return (data ?? []).map((row: any) => ({
    id: row.id,
    thumbnailUrl: row.thumbnail_url as string,
    caption: row.caption,
  }))
}

export async function LandingPage() {
  const posts = await getLatestThumbnails()

  return (
    <div className="grid md:grid-cols-2 md:min-h-[880px]">
      <div className="relative bg-teal text-paper px-6 py-12 md:py-16 flex flex-col items-center md:items-start justify-center text-center md:text-left overflow-hidden">
        <LandingPostsOrbit posts={posts} />
        <div className="relative z-10 max-w-md">
          <EyeLogo className="h-12 w-[72px] mb-6 mx-auto md:mx-0" blinkDelay={1} />
          <h1 className="font-display italic font-semibold text-4xl sm:text-5xl leading-[1.08] tracking-tight">
            SeenIt. <span className="text-caution">Shared it.</span>
          </h1>
          <p className="font-display text-lg text-paper/80 mt-4 max-w-sm mx-auto md:mx-0">
            Post what you saw. Find who else saw it. Turn it into action.
          </p>
        </div>
      </div>

      <div className="bg-paper px-6 py-12 md:py-16 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-evidence">
        <div className="w-full max-w-xs text-center">
          <EyeLogo className="h-10 w-[60px] mx-auto mb-6" />
          <p className="font-mono text-[11px] uppercase tracking-wider text-slate mb-6">Get started</p>
          <Link
            href="/signup"
            className="block font-mono text-xs uppercase tracking-wider px-4 py-2.5 bg-teal text-paper hover:bg-signal transition-colors rounded-full"
          >
            Sign up
          </Link>
          <p className="font-mono text-xs text-slate mt-5">
            Already have an account?{' '}
            <Link href="/login" className="text-teal hover:text-signal underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
