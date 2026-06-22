import { FeedTabs } from '@/components/FeedTabs'
import { EyeIcon } from '@/components/icons/Eye'

export default function HomePage() {
  return (
    <div>
      <section className="border-b border-evidence bg-gradient-to-b from-teal/5 to-transparent">
        <div className="mx-auto max-w-2xl px-4 py-12">
          <EyeIcon open className="h-9 w-16 text-teal mb-5" />
          <h1 className="font-display italic font-semibold text-4xl sm:text-5xl leading-[1.08] tracking-tight max-w-lg text-ink">
            SeenIt. <span className="text-teal">Shared it.</span>
          </h1>
          <p className="font-display text-lg sm:text-xl text-ink/80 mt-3 max-w-md">
            Let&rsquo;s make our community safer. Let&rsquo;s make this world a better place.
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
