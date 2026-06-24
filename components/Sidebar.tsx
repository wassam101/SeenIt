'use client'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

type NavItem = {
  label: string
  href: string
  icon: string
  comingSoon?: boolean
  active?: boolean
}

function NavIcon({ src, className }: { src: string; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" className={className} />
}

export function Sidebar({ userId }: { userId: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isNearbyFeed = searchParams.get('feed') === 'nearby'

  const items: NavItem[] = [
    { label: 'Home', href: '/', icon: '/sidebar-icons/Home.png', active: pathname === '/' && !isNearbyFeed },
    { label: 'Nearby', href: '/?feed=nearby', icon: '/sidebar-icons/Nearby.png', active: pathname === '/' && isNearbyFeed },
    { label: 'Share', href: '/post/new', icon: '/sidebar-icons/Share.png' },
    { label: 'Explore', href: '/explore', icon: '/sidebar-icons/Explore.png', comingSoon: true },
    { label: 'Updates', href: '/updates', icon: '/sidebar-icons/Updates.png', comingSoon: true },
    { label: 'Events', href: '/events', icon: '/sidebar-icons/Events.png' },
    { label: 'Discussions', href: '/events', icon: '/sidebar-icons/Discussions.png' },
    { label: 'Saved', href: '/saved', icon: '/sidebar-icons/Saved.png', comingSoon: true },
    { label: 'Insights', href: '/insights', icon: '/sidebar-icons/Insights.png', comingSoon: true },
    { label: 'Profile', href: `/u/${userId}`, icon: '/sidebar-icons/Profile.png' },
    { label: 'Settings', href: '/account', icon: '/sidebar-icons/Settings.png' },
  ]

  return (
    // The reserved width (w-56) never changes, so the feed next to it never
    // shifts and the rail never has to overlap it either — hovering only
    // fades the labels in within space that was already set aside for them.
    <nav
      aria-label="Main"
      className="group hidden md:block md:w-56 md:shrink-0 md:sticky md:top-[57px] md:self-start md:h-[calc(100vh-57px)] md:overflow-hidden md:py-6 md:pr-4 md:border-r md:border-evidence"
    >
      <div className="flex flex-col gap-1">
        {items.map(({ label, href, icon, comingSoon, active: explicitActive }) => {
          const active = !comingSoon && (explicitActive ?? pathname === href.split('?')[0])
          if (comingSoon) {
            return (
              <span
                key={label}
                aria-disabled="true"
                className="flex items-center gap-3 px-3 py-2.5 font-mono text-[13px] text-slate/50 cursor-default whitespace-nowrap"
                title="Coming soon"
              >
                <NavIcon src={icon} className="h-7 w-7 shrink-0" />
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">{label}</span>
                <span className="ml-auto font-mono text-[9px] uppercase tracking-wider text-slate/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  Soon
                </span>
              </span>
            )
          }
          return (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 font-mono text-[13px] transition-colors whitespace-nowrap ${
                active ? 'text-signal' : 'text-ink hover:text-teal'
              }`}
            >
              <NavIcon src={icon} className="h-7 w-7 shrink-0" />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
