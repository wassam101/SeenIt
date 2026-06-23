// app/post/[id]/page.tsx
import { SeenItButton } from '@/components/SeenItButton'
import { CommentThread } from '@/components/CommentThread'
import { ShareButton } from '@/components/ShareButton'
import { ReportButton } from '@/components/ReportButton'
import { PostEventLauncher } from '@/components/PostEventLauncher'
import { EyeIcon } from '@/components/icons/Eye'
import { Avatar } from '@/components/Avatar'
import { formatRelativeTime } from '@/lib/time'
import Link from 'next/link'

async function getPost(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/posts/${id}`, { cache: 'no-store' })
  if (!res.ok) return null
  return res.json()
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id)
  if (!post) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center">
        <p className="font-mono text-xs text-slate uppercase tracking-wider">404</p>
        <p className="font-display font-bold text-lg mt-1">This report doesn&apos;t exist, or was removed.</p>
      </div>
    )
  }

  return (
    <article className="mx-auto max-w-2xl">
      <div className="aspect-video bg-ink flex items-center justify-center">
        {post.mediaType === 'image' && post.imageUrl ? (
          <img src={post.imageUrl} alt={post.caption ?? ''} className="w-full h-full object-cover" />
        ) : post.status === 'ready' ? (
          <iframe
            src={`https://customer-${process.env.NEXT_PUBLIC_CF_STREAM_CUSTOMER_CODE}.cloudflarestream.com/${post.videoId}/iframe`}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowFullScreen
            title={post.caption ?? 'Post video'}
            className="w-full h-full"
          />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <EyeIcon open={false} className="h-7 w-12 text-paper/30" />
            <p className="font-mono text-xs text-paper/50 uppercase tracking-wider">Footage processing&hellip;</p>
          </div>
        )}
      </div>

      <div className="px-4 pt-4">
        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-slate">
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-signal rec-dot" aria-hidden="true" />
            {post.locationLabel ? `Seen at ${post.locationLabel}` : 'Seen'}
          </span>
          {post.createdAt && <span>{formatRelativeTime(post.createdAt)}</span>}
        </div>

        <p className="font-display font-bold text-xl mt-2 leading-snug">{post.caption}</p>
        {post.authorId ? (
          <Link href={`/u/${post.authorId}`} className="flex items-center gap-2 mt-1.5 hover:text-teal w-fit">
            <Avatar name={post.authorName} avatarUrl={post.authorAvatarUrl} size={22} />
            <p className="font-mono text-xs text-slate">{post.authorName}</p>
          </Link>
        ) : (
          <div className="flex items-center gap-2 mt-1.5">
            <Avatar name={post.authorName} avatarUrl={post.authorAvatarUrl} size={22} />
            <p className="font-mono text-xs text-slate">{post.authorName}</p>
          </div>
        )}

        <div className="flex items-center gap-2 mt-4 pb-4 border-b border-evidence">
          <SeenItButton postId={post.id} initiallySeen={false} />
          <ShareButton postId={post.id} />
          <ReportButton targetType="post" targetId={post.id} />
        </div>

        <div className="py-4 border-b border-evidence">
          <PostEventLauncher postId={post.id} />
        </div>

        <div className="py-4">
          <CommentThread postId={post.id} />
        </div>
      </div>
    </article>
  )
}
