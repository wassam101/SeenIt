'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Avatar } from '@/components/Avatar'
import { signOut } from '@/app/(auth)/actions'

function BrandMark({ className }: { className?: string }) {
  // The triangle stays still; only the eye (lids/pupil/dot) blinks, so the
  // two are separate layers rather than one image animated as a whole.
  return (
    <span className={`relative inline-block ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand-eye-triangle.png" alt="" className="absolute inset-0 h-full w-full" />
      <span className="eye-blink-loop absolute inset-0 block" style={{ transformOrigin: 'center' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand-eye-eye.png" alt="" className="h-full w-full" />
      </span>
    </span>
  )
}

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
          <BrandMark className="h-14 w-14" />
          <span className="flex items-center gap-1">
            <span className="font-display italic font-semibold text-xl tracking-tight text-ink">SeenIt</span>
            <span className="h-2 w-2 rounded-full bg-signal" aria-hidden="true" />
          </span>
        </Link>
        <nav className="flex items-center gap-4 font-sans text-[15px] font-medium text-slate">
          {displayName ? (
            <>
              <Link href="/account" className="flex items-center gap-2 text-ink hover:text-teal transition-colors">
                <Avatar name={displayName} avatarUrl={avatarUrl} size={28} />
                <strong className="font-semibold">{displayName}</strong>
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="text-white bg-teal px-4 py-2 rounded-full font-semibold hover:bg-signal transition-colors"
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
                className="text-white bg-teal px-4 py-2 rounded-full font-semibold hover:bg-signal transition-colors"
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
