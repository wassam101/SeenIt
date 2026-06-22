'use client'
import { useState } from 'react'
import { formatRelativeTime } from '@/lib/time'
import { EyeIcon } from '@/components/icons/Eye'

type Post = {
  id: string
  authorName: string
  thumbnailUrl: string | null
  caption: string | null
  createdAt?: string
}

export function PostCard({ post }: { post: Post }) {
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = post.thumbnailUrl && !imageFailed

  return (
    <a
      href={`/post/${post.id}`}
      className="block border border-evidence border-l-4 border-l-caution bg-white/40 hover:bg-white transition-colors"
    >
      <div className="flex items-center justify-between px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-slate">
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-signal rec-dot" aria-hidden="true" />
          Witness report
        </span>
        {post.createdAt && <span>{formatRelativeTime(post.createdAt)}</span>}
      </div>
      <div className="viewfinder aspect-video bg-ink/90 flex items-center justify-center overflow-hidden">
        {showImage ? (
          <img
            src={post.thumbnailUrl!}
            alt={post.caption ?? ''}
            onError={() => setImageFailed(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <EyeIcon open={false} className="h-6 w-10 text-paper/25" />
        )}
      </div>
      <div className="px-3 py-3">
        <p className="font-display font-bold text-base leading-snug">{post.caption}</p>
        <p className="font-mono text-xs text-slate mt-1">By {post.authorName}</p>
      </div>
    </a>
  )
}
