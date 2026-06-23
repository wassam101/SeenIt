type OrbitPost = { id: string; thumbnailUrl: string; caption: string | null }

// Captions vary a lot in length, and we never want to clip them, so tile
// height has to be content-driven rather than a fixed guess. Normal-flow
// groups (flex-col/flex-row with a gap) give that for free: CSS lays each
// tile out without overlapping its neighbors no matter how tall any one
// caption turns out to be. The headline/subhead/logo block is centered
// vertically in this panel (justify-center) and sits in its left ~74% on
// md+ screens, leaving a clear band above and below it for a row of tiles,
// plus the full-height strip to its right for a column of tiles. On
// narrower screens that text is centered instead, so there's no safe gap
// left for this decorative layer — it's hidden below the md breakpoint.
// Only a small drift animation is layered on top via transform, which
// doesn't affect layout, so the gaps between tiles comfortably absorb it.
const TOP_ROW_TILES = [
  { width: 108, duration: 12, delay: -3, orbitX: 6, orbitY: 6, rotate: -3 },
  { width: 108, duration: 14, delay: -7, orbitX: 6, orbitY: 6, rotate: 3 },
] as const

const BOTTOM_ROW_TILES = [
  { width: 108, duration: 13, delay: -2, orbitX: 6, orbitY: 6, rotate: 3 },
  { width: 108, duration: 10, delay: -6, orbitX: 6, orbitY: 6, rotate: -3 },
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
      {post.caption && <p className="px-2 py-1.5 font-mono text-[11px] leading-snug text-paper">{post.caption}</p>}
    </div>
  )
}

export function LandingPostsOrbit({ posts }: { posts: OrbitPost[] }) {
  const topTiles = posts.slice(0, TOP_ROW_TILES.length)
  const bottomTiles = posts.slice(topTiles.length, topTiles.length + BOTTOM_ROW_TILES.length)
  const rightTiles = posts.slice(topTiles.length + bottomTiles.length, topTiles.length + bottomTiles.length + RIGHT_COLUMN_TILES.length)

  return (
    <div className="absolute inset-0 overflow-hidden hidden md:block" aria-hidden="true">
      <div className="absolute top-4 left-4 right-[170px] flex flex-row gap-3">
        {topTiles.map((post, i) => (
          <OrbitTile key={post.id} post={post} preset={TOP_ROW_TILES[i]} />
        ))}
      </div>
      <div className="absolute bottom-4 left-4 right-[170px] flex flex-row gap-3">
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
