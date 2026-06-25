'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatRelativeTime } from '@/lib/time'
import { EyeIcon } from '@/components/icons/Eye'
import { CommentIcon } from '@/components/icons/Comment'
import { Avatar } from '@/components/Avatar'
import { SeenItButton } from '@/components/SeenItButton'
import { RepostButton } from '@/components/RepostButton'
import { ShareButton } from '@/components/ShareButton'
import { BookmarkButton } from '@/components/BookmarkButton'
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
  likeCount: number
  repostCount: number
  isOwnPost: boolean
  saved: boolean
}

export function PostCard({ post }: { post: Post }) {
  const [imageFailed, setImageFailed] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [details, setDetails] = useState<PostDetails | null>(null)
  const [caption, setCaption] = useState(post.caption)
  const [editing, setEditing] = useState(false)
  const [editDraft, setEditDraft] = useState(post.caption ?? '')
  const [deleted, setDeleted] = useState(false)
  const showImage = post.thumbnailUrl && !imageFailed

  useEffect(() => {
    let cancelled = false
    fetch(`/api/posts/${post.id}`).then((res) => {
      if (res.ok && !cancelled) res.json().then(setDetails)
    })
    return () => {
      cancelled = true
    }
  }, [post.id])

  function toggleExpanded() {
    setExpanded((v) => !v)
  }

  function expandForGoToPost() {
    setExpanded(true)
  }

  function startEdit() {
    setEditDraft(caption ?? '')
    setEditing(true)
  }

  async function saveEdit() {
    const res = await fetch(`/api/posts/${post.id}`, { method: 'PATCH', body: JSON.stringify({ caption: editDraft }) })
    if (res.ok) {
      setCaption(editDraft)
      setEditing(false)
    }
  }

  async function deletePost() {
    const res = await fetch(`/api/posts/${post.id}`, { method: 'DELETE' })
    if (res.ok) setDeleted(true)
  }

  if (deleted) return null

  return (
    <div className="bg-paper/40 hover:bg-paper transition-colors">
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
        <PostMenu
          postId={post.id}
          authorId={post.authorId}
          isOwnPost={details?.isOwnPost}
          onGoToPost={expandForGoToPost}
          onEdit={startEdit}
          onDelete={deletePost}
        />
      </div>

      <div onClick={toggleExpanded} role="button" tabIndex={0} aria-expanded={expanded} className="cursor-pointer">
        <div className="aspect-video bg-black/90 flex items-center justify-center overflow-hidden">
          {expanded && details?.mediaType === 'image' && details.imageUrl ? (
            <img src={details.imageUrl} alt={caption ?? ''} className="w-full h-full object-cover" />
          ) : expanded && details?.mediaType === 'video' ? (
            details.status === 'ready' ? (
              <iframe
                src={`https://customer-${process.env.NEXT_PUBLIC_CF_STREAM_CUSTOMER_CODE}.cloudflarestream.com/${details.videoId}/iframe`}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
                title={caption ?? 'Post video'}
                className="w-full h-full"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <EyeIcon open={false} className="h-7 w-12 text-white/30" />
                <p className="font-sans text-sm text-white/50">Footage processing&hellip;</p>
              </div>
            )
          ) : showImage ? (
            <img
              src={post.thumbnailUrl!}
              alt={caption ?? ''}
              onError={() => setImageFailed(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <EyeIcon open={false} className="h-6 w-10 text-white/25" />
          )}
        </div>
        <div className="px-3 py-3" onClick={(e) => editing && e.stopPropagation()}>
          {editing ? (
            <div className="flex flex-col gap-2">
              <textarea
                value={editDraft}
                onChange={(e) => setEditDraft(e.target.value)}
                rows={2}
                className="w-full border border-evidence bg-paper px-3 py-2 text-sm focus-visible:border-ink"
              />
              <div className="flex gap-2">
                <button
                  onClick={saveEdit}
                  className="font-sans text-sm font-semibold rounded-full px-3 py-1.5 bg-teal text-white hover:bg-signal transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="font-sans text-sm font-semibold rounded-full px-3 py-1.5 text-slate hover:text-ink transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="font-display font-bold text-base leading-snug">{caption}</p>
          )}
        </div>
      </div>

      <div className="px-3 pb-3">
        <div className="flex items-center justify-between pb-3 border-t border-evidence pt-3">
          <div className="flex items-center gap-6">
            <SeenItButton postId={post.id} initiallySeen={false} initialCount={details?.likeCount} />
            <span className="flex items-center gap-1.5 font-sans text-sm text-slate">
              <CommentIcon className="h-5 w-5" />
              {details && details.commentCount > 0 && <span>{details.commentCount}</span>}
            </span>
            <RepostButton postId={post.id} initialCount={details?.repostCount} />
            <ShareButton postId={post.id} caption={caption} />
          </div>
          <BookmarkButton postId={post.id} initiallySaved={details?.saved ?? false} />
        </div>
        <div className="pb-3 border-t border-evidence pt-3">
          <PostEventLauncher postId={post.id} />
        </div>
        <div className="border-t border-evidence pt-3">
          <CommentThread postId={post.id} />
        </div>
      </div>
    </div>
  )
}

function PostHeaderMeta({ post }: { post: Post }) {
  return (
    <div className="min-w-0">
      <p className="font-sans text-[15px] font-semibold text-ink truncate">
        {post.authorName}
        {post.createdAt && <span className="font-normal text-slate"> &middot; {formatRelativeTime(post.createdAt)}</span>}
      </p>
      <p className="flex items-center gap-1.5 font-sans text-sm text-slate truncate">
        <span className="size-1.5 rounded-full bg-signal rec-dot shrink-0" aria-hidden="true" />
        {post.locationLabel ? `Seen at ${post.locationLabel}` : 'Seen'}
      </p>
    </div>
  )
}
