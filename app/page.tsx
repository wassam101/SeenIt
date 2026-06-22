import { Suspense } from 'react'
import { FeedTabs } from '@/components/FeedTabs'
import { EyeLogo } from '@/components/icons/Logo'
import { WelcomeBanner } from '@/components/WelcomeBanner'

export default function HomePage() {
  return (
    <div>
      <Suspense fallback={null}>
        <WelcomeBanner />
      </Suspense>
      <section className="border-b border-evidence bg-gradient-to-b from-teal/5 to-transparent">
        <div className="mx-auto max-w-2xl px-4 py-12">
          <EyeLogo className="h-12 w-[72px] mb-5" blinkDelay={3} />
          <h1 className="font-display italic font-semibold text-4xl sm:text-5xl leading-[1.08] tracking-tight max-w-lg text-ink">
            SeenIt. <span className="text-teal">Shared it</span><span className="text-signal">.</span>
          </h1>
          <p className="font-display text-lg sm:text-xl text-ink/80 mt-3 max-w-md">
            What one person notices can help an entire community make safer decisions.
          </p>
          <p className="font-mono text-[13px] font-medium text-slate mt-4 max-w-sm">
            Post what you saw. Find who else saw it. Turn it into action.
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-2xl px-4 py-6">
        <FeedTabs />
      </div>
    </div>
  )
}
