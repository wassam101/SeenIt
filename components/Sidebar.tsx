'use client'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { EyeIcon } from '@/components/icons/Eye'
import {
  PinIcon,
  CameraIcon,
  CompassIcon,
  BellIcon,
  CalendarIcon,
  DiscussionIcon,
  BookmarkIcon,
  InsightsIcon,
  ProfileIcon,
  SettingsGearIcon,
} from '@/components/icons/SidebarIcons'

type NavItem = {
  label: string
  href: string
  icon: (props: { className?: string }) => JSX.Element
  comingSoon?: boolean
  active?: boolean
}

export function Sidebar({ userId }: { userId: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isNearbyFeed = searchParams.get('feed') === 'nearby'

  const items: NavItem[] = [
    { label: 'Home', href: '/', icon: (p) => <EyeIcon open {...p} />, active: pathname === '/' && !isNearbyFeed },
    { label: 'Nearby', href: '/?feed=nearby', icon: PinIcon, active: pathname === '/' && isNearbyFeed },
    { label: 'Share', href: '/post/new', icon: CameraIcon },
    { label: 'Explore', href: '/explore', icon: CompassIcon, comingSoon: true },
    { label: 'Updates', href: '/updates', icon: BellIcon, comingSoon: true },
    // Events and Discussions both point at the events list for now: there's
    // no separate "discussion board" feature yet, just event threads.
    { label: 'Events', href: '/events', icon: CalendarIcon },
    { label: 'Discussions', href: '/events', icon: DiscussionIcon },
    { label: 'Saved', href: '/saved', icon: BookmarkIcon, comingSoon: true },
    { label: 'Insights', href: '/insights', icon: InsightsIcon, comingSoon: true },
    { label: 'Profile', href: `/u/${userId}`, icon: ProfileIcon },
    { label: 'Settings', href: '/account', icon: SettingsGearIcon },
  ]

  return (
    <nav
      aria-label="Main"
      className="hidden md:flex md:flex-col md:gap-1 md:w-56 md:shrink-0 md:py-6 md:pr-4 md:border-r md:border-evidence"
    >
      {items.map(({ label, href, icon: Icon, comingSoon, active: explicitActive }) => {
        const active = !comingSoon && (explicitActive ?? pathname === href.split('?')[0])
        if (comingSoon) {
          return (
            <span
              key={label}
              aria-disabled="true"
              className="flex items-center gap-3 px-3 py-2.5 font-mono text-[13px] text-slate/50 cursor-default"
              title="Coming soon"
            >
              <Icon className="h-4 w-4" />
              {label}
              <span className="ml-auto font-mono text-[9px] uppercase tracking-wider text-slate/40">Soon</span>
            </span>
          )
        }
        return (
          <Link
            key={label}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 font-mono text-[13px] transition-colors ${
              active ? 'text-signal' : 'text-ink hover:text-teal'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
