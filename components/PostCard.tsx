'use client'
import { useState } from 'react'
import Link from 'next/link'
import { formatRelativeTime } from '@/lib/time'
import { EyeIcon } from '@/components/icons/Eye'
import { Avatar } from '@/components/Avatar'
import { SeenItButton } from '@/components/SeenItButton'
import { ShareButton } from '@/components/ShareButton'
import { PostEventLauncher } from '@/components/PostEventLauncher'
import { CommentThread } from '@/components/CommentThread'
import { PostMenu } from '@/components/PostMenu'

type Post = {
  id: string
  authorId?: string | null
  authorName: string
  authorAvatarUrl?: string | null
  thumbnailUrl: string | null
  caption: string | null
  createdAt?: string
  locationLabel?: string | null
}

type PostDetails = {
  mediaType: 'image' | 'video'
  videoId: string | null
  imageUrl: string | null
  status: string
  caption: string | null
  commentCount: number
}

export function PostCard({ post }: { post: Post }) {
  const [imageFailed, setImageFailed] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [details, setDetails] = useState<PostDetails | null>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const showImage = post.thumbnailUrl && !imageFailed

  async function toggleExpanded() {
    if (expanded) {
      setExpanded(false)
      return
    }
    setExpanded(true)
    if (details || loadingDetails) return
    setLoadingDetails(true)
    const res = await fetch(`/api/posts/${post.id}`)
    if (res.ok) setDetails(await res.json())
    setLoadingDetails(false)
  }

  function expandForGoToPost() {
    if (!expanded) toggleExpanded()
  }

  return (
    <div className="bg-white/40 hover:bg-white transition-colors">
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        {post.authorId ? (
          <Link href={`/u/${post.authorId}`} className="flex items-center gap-2.5 hover:text-teal flex-1 min-w-0">
            <Avatar name={post.authorName} avatarUrl={post.authorAvatarUrl} size={36} />
            <PostHeaderMeta post={post} />
          </Link>
        ) : (
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <Avatar name={post.authorName} avatarUrl={post.authorAvatarUrl} size={36} />
            <PostHeaderMeta post={post} />
          </div>
        )}
        <PostMenu postId={post.id} authorId={post.authorId} onGoToPost={expandForGoToPost} />
      </div>

      <div onClick={toggleExpanded} role="button" tabIndex={0} aria-expanded={expanded} className="cursor-pointer">
        <div className="aspect-video bg-ink/90 flex items-center justify-center overflow-hidden">
          {expanded && details?.mediaType === 'image' && details.imageUrl ? (
            <img src={details.imageUrl} alt={post.caption ?? ''} className="w-full h-full object-cover" />
          ) : expanded && details?.mediaType === 'video' ? (
            details.status === 'ready' ? (
              <iframe
                src={`https://customer-${process.env.NEXT_PUBLIC_CF_STREAM_CUSTOMER_CODE}.cloudflarestream.com/${details.videoId}/iframe`}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
                title={post.caption ?? 'Post video'}
                className="w-full h-full"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <EyeIcon open={false} className="h-7 w-12 text-paper/30" />
                <p className="font-mono text-xs text-paper/50 uppercase tracking-wider">Footage processing&hellip;</p>
              </div>
            )
          ) : showImage ? (
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
        </div>
      </div>

      {expanded && (
        <div className="px-3 pb-3">
          <div className="flex items-center gap-2 pb-3 border-t border-evidence pt-3">
            <SeenItButton postId={post.id} initiallySeen={false} />
            <ShareButton postId={post.id} />
          </div>
          <div className="pb-3 border-t border-evidence pt-3">
            <PostEventLauncher postId={post.id} />
          </div>
          <div className="border-t border-evidence pt-3">
            <button
              onClick={() => setCommentsOpen((open) => !open)}
              className="font-mono text-xs uppercase tracking-wider text-teal hover:text-signal transition-colors"
            >
              {commentsOpen ? 'Hide comments' : `Comments${details ? ` (${details.commentCount})` : ''}`}
            </button>
            {commentsOpen && (
              <div className="mt-3">
                <CommentThread postId={post.id} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function PostHeaderMeta({ post }: { post: Post }) {
  return (
    <div className="min-w-0">
      <p className="font-mono text-[13px] font-semibold text-ink truncate">
        {post.authorName}
        {post.createdAt && <span className="font-normal text-slate"> &middot; {formatRelativeTime(post.createdAt)}</span>}
      </p>
      <p className="flex items-center gap-1.5 font-mono text-[11px] text-slate truncate">
        <span className="size-1.5 rounded-full bg-signal rec-dot shrink-0" aria-hidden="true" />
        {post.locationLabel ? `Seen at ${post.locationLabel}` : 'Seen'}
      </p>
    </div>
  )
}
