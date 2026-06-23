type OrbitPost = { id: string; thumbnailUrl: string; caption: string | null }

// Scattered, freely-overlapping placements rather than tidy non-overlapping
// rows — a livelier "collage" feel was explicitly preferred over the earlier
// tidy layout. The only hard constraint is staying clear of the text block,
// which sits left-aligned on md+ screens at roughly x:0-64%, y:39-61% of
// this panel (logo + headline + subhead, centered vertically via
// justify-center). Every tile below keeps clear of that rectangle: tiles
// with left < 64% stay entirely above y 39% or below y 61%; tiles with
// left >= 64% can use any vertical position since they're already clear
// horizontally. Captions are clamped to 2 lines so each tile's height is
// deterministic, which is what makes that math reliable. On narrower
// screens the text is centered instead, so there's no safe gap left for
// this decorative layer — it's hidden below the md breakpoint.
const TILE_PRESETS = [
  { top: '2%', left: '5%', width: 110, duration: 13, delay: -2, orbitX: 14, orbitY: 16, rotate: -6 },
  { top: '18%', left: '25%', width: 90, duration: 9, delay: -5, orbitX: 12, orbitY: 14, rotate: 5 },
  { top: '3%', left: '45%', width: 130, duration: 16, delay: -8, orbitX: 16, orbitY: 12, rotate: -4 },
  { top: '20%', left: '8%', width: 80, duration: 11, delay: -1, orbitX: 10, orbitY: 14, rotate: 7 },
  { top: '70%', left: '10%', width: 100, duration: 14, delay: -6, orbitX: 14, orbitY: 16, rotate: -5 },
  { top: '80%', left: '30%', width: 90, duration: 10, delay: -3, orbitX: 12, orbitY: 12, rotate: 4 },
  { top: '65%', left: '48%', width: 110, duration: 18, delay: -9, orbitX: 16, orbitY: 14, rotate: -3 },
  { top: '75%', left: '5%', width: 70, duration: 8, delay: -4, orbitX: 10, orbitY: 10, rotate: 6 },
  { top: '5%', left: '70%', width: 120, duration: 15, delay: -7, orbitX: 18, orbitY: 16, rotate: -5 },
  { top: '25%', left: '80%', width: 100, duration: 12, delay: -2.5, orbitX: 14, orbitY: 18, rotate: 6 },
  { top: '45%', left: '68%', width: 130, duration: 17, delay: -10, orbitX: 16, orbitY: 14, rotate: -4 },
  { top: '60%', left: '82%', width: 90, duration: 9, delay: -6.5, orbitX: 12, orbitY: 16, rotate: 5 },
  { top: '80%', left: '70%', width: 110, duration: 13, delay: -4.5, orbitX: 14, orbitY: 12, rotate: -6 },
] as const

function OrbitTile({
  post,
  preset,
}: {
  post: OrbitPost
  preset: { top: string; left: string; width: number; duration: number; delay: number; orbitX: number; orbitY: number; rotate: number }
}) {
  return (
    <div
      className="post-orbit absolute rounded-xl overflow-hidden bg-paper/10 backdrop-blur-sm border border-paper/25 shadow-lg shadow-ink/20"
      style={
        {
          top: preset.top,
          left: preset.left,
          width: preset.width,
          animationDuration: `${preset.duration}s`,
          animationDelay: `${preset.delay}s`,
          '--orbit-x': `${preset.orbitX}px`,
          '--orbit-y': `${preset.orbitY}px`,
          '--orbit-rotate': `${preset.rotate}deg`,
        } as React.CSSProperties
      }
    >
      <img src={post.thumbnailUrl} alt="" className="w-full aspect-square object-cover" />
      {post.caption && (
        <p className="px-2 py-1.5 font-mono text-[11px] leading-snug text-paper line-clamp-2">{post.caption}</p>
      )}
    </div>
  )
}

export function LandingPostsOrbit({ posts }: { posts: OrbitPost[] }) {
  const tiles = posts.slice(0, TILE_PRESETS.length)

  return (
    <div className="absolute inset-0 overflow-hidden hidden md:block" aria-hidden="true">
      {tiles.map((post, i) => (
        <OrbitTile key={post.id} post={post} preset={TILE_PRESETS[i]} />
      ))}
    </div>
  )
}
