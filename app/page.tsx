import { Suspense } from 'react'
import { FeedTabs } from '@/components/FeedTabs'
import { WelcomeBanner } from '@/components/WelcomeBanner'
import { LandingPage } from '@/components/LandingPage'
import { createServerSupabase } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = createServerSupabase()
  const { data } = await supabase.auth.getUser()
  if (!data.user) {
    return <LandingPage />
  }

  return (
    <div>
      <Suspense fallback={null}>
        <WelcomeBanner />
      </Suspense>
      <div className="mx-auto max-w-2xl px-4 py-6">
        <Suspense fallback={null}>
          <FeedTabs />
        </Suspense>
      </div>
    </div>
  )
}
