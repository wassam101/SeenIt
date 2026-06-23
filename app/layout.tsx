import type { Metadata } from "next";
import { Suspense } from "react";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { Sidebar } from "@/components/Sidebar";
import { createServerSupabase } from "@/lib/supabase/server";
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
        <SiteHeader displayName={displayName} avatarUrl={avatarUrl} />
        {userData.user ? (
          <div className="flex-1 mx-auto w-full max-w-5xl flex md:px-4">
            <Suspense fallback={null}>
              <Sidebar userId={userData.user.id} />
            </Suspense>
            <main className="flex-1 min-w-0">{children}</main>
          </div>
        ) : (
          <main className="flex-1">{children}</main>
        )}
      </body>
    </html>
  );
}
