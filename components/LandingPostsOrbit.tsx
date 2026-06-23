type OrbitPost = { id: string; thumbnailUrl: string; caption: string | null }

// Captions vary a lot in length. Earlier this stayed content-driven (no
// clamp) so nothing was ever cut, but with 11 tiles now packed into three
// tight zones, an unclamped caption is exactly what caused the bottom row
// to occasionally clip against the panel edge — one long caption could push
// a row's height past its margin. Clamping every caption to 2 lines makes
// every tile the same fixed height, so the layout is fully deterministic:
// no tile can ever grow into its neighbor, the text below it, or the panel
// edge, no matter what the caption says. Normal-flow groups (flex-col for
// the column, flex-row for the rows) still guarantee no overlap within
// each group on top of that. The headline/subhead/logo block is centered
// vertically in this panel (justify-center) and sits in its left ~74% on
// md+ screens, leaving a clear band above and below it for a row of tiles,
// plus the full-height strip to its right for a column of tiles. On
// narrower screens that text is centered instead, so there's no safe gap
// left for this decorative layer — it's hidden below the md breakpoint.
// Only a small drift animation is layered on top via transform, which
// doesn't affect layout, so the gaps between tiles comfortably absorb it.
const TOP_ROW_TILES = [
  { width: 100, duration: 12, delay: -3, orbitX: 6, orbitY: 6, rotate: -3 },
  { width: 100, duration: 14, delay: -7, orbitX: 6, orbitY: 6, rotate: 3 },
  { width: 100, duration: 11, delay: -9, orbitX: 6, orbitY: 6, rotate: -2 },
  { width: 100, duration: 15, delay: -1, orbitX: 6, orbitY: 6, rotate: 2 },
] as const

const BOTTOM_ROW_TILES = [
  { width: 100, duration: 13, delay: -2, orbitX: 6, orbitY: 6, rotate: 3 },
  { width: 100, duration: 10, delay: -6, orbitX: 6, orbitY: 6, rotate: -3 },
  { width: 100, duration: 16, delay: -4, orbitX: 6, orbitY: 6, rotate: 2 },
  { width: 100, duration: 9, delay: -8, orbitX: 6, orbitY: 6, rotate: -2 },
] as const

const RIGHT_COLUMN_TILES = [
  { width: 130, duration: 11, delay: -2, orbitX: 7, orbitY: 8, rotate: -3 },
  { width: 130, duration: 13, delay: -5, orbitX: 6, orbitY: 7, rotate: 3 },
  { width: 130, duration: 15, delay: -8, orbitX: 7, orbitY: 7, rotate: -2 },
] as const

function OrbitTile({
  post,
  preset,
}: {
  post: OrbitPost
  preset: { width: number; duration: number; delay: number; orbitX: number; orbitY: number; rotate: number }
}) {
  return (
    <div
      className="post-orbit shrink-0 rounded-xl overflow-hidden bg-paper/10 backdrop-blur-sm border border-paper/25 shadow-lg shadow-ink/20"
      style={
        {
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
  const topTiles = posts.slice(0, TOP_ROW_TILES.length)
  const bottomTiles = posts.slice(topTiles.length, topTiles.length + BOTTOM_ROW_TILES.length)
  const rightTiles = posts.slice(topTiles.length + bottomTiles.length, topTiles.length + bottomTiles.length + RIGHT_COLUMN_TILES.length)

  return (
    <div className="absolute inset-0 overflow-hidden hidden md:block" aria-hidden="true">
      <div className="absolute top-8 left-4 right-[170px] flex flex-row gap-2">
        {topTiles.map((post, i) => (
          <OrbitTile key={post.id} post={post} preset={TOP_ROW_TILES[i]} />
        ))}
      </div>
      <div className="absolute bottom-12 left-4 right-[170px] flex flex-row gap-2">
        {bottomTiles.map((post, i) => (
          <OrbitTile key={post.id} post={post} preset={BOTTOM_ROW_TILES[i]} />
        ))}
      </div>
      <div className="absolute top-3 right-3 w-[130px] flex flex-col gap-3">
        {rightTiles.map((post, i) => (
          <OrbitTile key={post.id} post={post} preset={RIGHT_COLUMN_TILES[i]} />
        ))}
      </div>
    </div>
  )
}
