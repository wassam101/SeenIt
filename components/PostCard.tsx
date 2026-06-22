'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatRelativeTime } from '@/lib/time'
import { EyeIcon } from '@/components/icons/Eye'
import { Avatar } from '@/components/Avatar'

type Post = {
  id: string
  authorId?: string | null
  authorName: string
  authorAvatarUrl?: string | null
  thumbnailUrl: string | null
  caption: string | null
  createdAt?: string
}

export function PostCard({ post }: { post: Post }) {
  const router = useRouter()
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = post.thumbnailUrl && !imageFailed

  return (
    <div
      onClick={() => router.push(`/post/${post.id}`)}
      role="link"
      tabIndex={0}
      className="block bg-white/40 hover:bg-white transition-colors cursor-pointer"
    >
      <div className="flex items-center justify-between px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-slate">
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-signal rec-dot" aria-hidden="true" />
          Witness report
        </span>
        {post.createdAt && <span>{formatRelativeTime(post.createdAt)}</span>}
      </div>
      <div className="aspect-video bg-ink/90 flex items-center justify-center overflow-hidden">
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
        <div className="flex items-center gap-1.5 mt-2">
          {post.authorId ? (
            <Link
              href={`/u/${post.authorId}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 hover:text-teal"
            >
              <Avatar name={post.authorName} avatarUrl={post.authorAvatarUrl} size={18} />
              <p className="font-mono text-xs text-slate">{post.authorName}</p>
            </Link>
          ) : (
            <>
              <Avatar name={post.authorName} avatarUrl={post.authorAvatarUrl} size={18} />
              <p className="font-mono text-xs text-slate">{post.authorName}</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
