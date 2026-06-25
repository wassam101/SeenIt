'use client'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { HouseIcon } from '@/components/icons/House'

type NavItem = {
  label: string
  href: string
  icon: string
  comingSoon?: boolean
  active?: boolean
}

function NavIcon({ src, className }: { src: string; className?: string }) {
  // Recolors the icon artwork via CSS mask (using its alpha shape only) so it
  // can render solid white / signal-red against the dark theme instead of
  // the original muddy teal-and-red two-tone, which had poor contrast on black.
  return (
    <span
      aria-hidden="true"
      className={className}
      style={{
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
      }}
    />
  )
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
    { label: 'Saved', href: '/saved', icon: '/sidebar-icons/Saved.png' },
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
                className="flex items-center gap-4 rounded-full px-3 py-3 font-sans text-xl text-slate/50 cursor-default whitespace-nowrap"
                title="Coming soon"
              >
                <NavIcon src={icon} className="h-9 w-9 shrink-0 bg-white/30" />
                <span>{label}</span>
                <span className="ml-auto font-sans text-xs text-slate/40">
                  Soon
                </span>
              </span>
            )
          }
          return (
            <Link
              key={label}
              href={href}
              className={`group/nav flex items-center gap-4 rounded-full px-3 py-3 font-sans text-xl transition-colors whitespace-nowrap hover:bg-evidence/40 ${
                active ? 'font-bold text-signal' : 'font-medium text-ink hover:text-teal'
              }`}
            >
              {label === 'Home' ? (
                <HouseIcon
                  className={`h-9 w-9 shrink-0 transition-colors ${active ? 'text-signal' : 'text-white group-hover/nav:text-signal'}`}
                />
              ) : (
                <NavIcon
                  src={icon}
                  className={`h-9 w-9 shrink-0 transition-colors ${active ? 'bg-signal' : 'bg-white group-hover/nav:bg-signal'}`}
                />
              )}
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
