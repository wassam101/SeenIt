import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import Link from "next/link";
import { EyeLogo } from "@/components/icons/Logo";
import { Avatar } from "@/components/Avatar";
import { createServerSupabase } from "@/lib/supabase/server";
import { signOut } from "@/app/(auth)/actions";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = Plus_Jakarta_Sans({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "SeenIt — witness it, organize it",
  description: "Post what you saw. Find who else saw it. Do something about it.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createServerSupabase();
  const { data: userData } = await supabase.auth.getUser();
  let displayName: string | null = null;
  let avatarUrl: string | null = null;
  if (userData.user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, avatar_url, is_anonymous")
      .eq("id", userData.user.id)
      .single();
    const p = profile as { display_name?: string; avatar_url?: string; is_anonymous?: boolean } | null;
    displayName = p?.is_anonymous ? "Anonymous" : p?.display_name ?? userData.user.email ?? "Account";
    avatarUrl = p?.is_anonymous ? null : p?.avatar_url ?? null;
  }

  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
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
                  <Link href="/post/new" className="hover:text-teal transition-colors">
                    Post
                  </Link>
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
                  <Link href="/post/new" className="hover:text-teal transition-colors">
                    Post
                  </Link>
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
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
