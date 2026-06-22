import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import Link from "next/link";
import { EyeIcon } from "@/components/icons/Eye";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <header className="border-b border-evidence sticky top-0 z-10 bg-paper/95 backdrop-blur-sm">
          <div className="mx-auto max-w-2xl px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <EyeIcon open className="h-5 w-8 text-teal logo-blink" />
              <span className="font-display italic font-semibold text-xl tracking-tight text-ink">SeenIt</span>
            </Link>
            <nav className="flex items-center gap-4 font-mono text-[13px] font-medium text-slate">
              <Link href="/post/new" className="hover:text-teal transition-colors">
                Post
              </Link>
              <Link href="/login" className="hover:text-teal transition-colors">
                Log in
              </Link>
              <Link
                href="/signup"
                className="text-paper bg-teal px-3 py-1.5 rounded-full hover:bg-ink transition-colors"
              >
                Sign up
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
