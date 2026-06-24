'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { EyeLogo } from '@/components/icons/Logo'
import { Avatar } from '@/components/Avatar'
import { MessagesFlyout } from '@/components/MessagesFlyout'
import { signOut } from '@/app/(auth)/actions'

export function SiteHeader({ displayName, avatarUrl }: { displayName: string | null; avatarUrl: string | null }) {
  const pathname = usePathname()

  // The landing page (root path, signed out) already has its own logo and
  // sign up/log in calls to action, so the global nav bar would just repeat them.
  if (pathname === '/' && !displayName) {
    return null
  }

  return (
    <header className="border-b border-evidence sticky top-0 z-10 bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto max-w-2xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <EyeLogo className="h-8 w-12" />
          <span className="font-display italic font-semibold text-xl tracking-tight text-ink">SeenIt</span>
        </Link>
        <nav className="flex items-center gap-4 font-mono text-[13px] font-medium text-slate">
          {displayName ? (
            <>
              <Link href="/account" className="flex items-center gap-2 text-ink hover:text-teal transition-colors">
                <Avatar name={displayName} avatarUrl={avatarUrl} size={28} />
                <strong className="font-semibold">{displayName}</strong>
              </Link>
              <MessagesFlyout />
              <form action={signOut}>
                <button
                  type="submit"
                  className="text-paper bg-teal px-3 py-1.5 rounded-full hover:bg-signal transition-colors"
                >
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-teal transition-colors">
                Log in
              </Link>
              <Link
                href="/signup"
                className="text-paper bg-teal px-3 py-1.5 rounded-full hover:bg-signal transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
