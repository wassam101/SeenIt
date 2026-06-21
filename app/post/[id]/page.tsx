// app/post/[id]/page.tsx
import { LikeButton } from '@/components/LikeButton'
import { CommentThread } from '@/components/CommentThread'
import { RepostButton } from '@/components/RepostButton'
import { ReportButton } from '@/components/ReportButton'
import { PostEventLauncher } from '@/components/PostEventLauncher'

async function getPost(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/posts/${id}`, { cache: 'no-store' })
  if (!res.ok) return null
  return res.json()
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id)
  if (!post) {
    return <p>Post not found.</p>
  }

  return (
    <article>
      {post.status === 'ready' ? (
        <iframe
          src={`https://customer-${process.env.NEXT_PUBLIC_CF_STREAM_CUSTOMER_CODE}.cloudflarestream.com/${post.videoId}/iframe`}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowFullScreen
          title={post.caption ?? 'Post video'}
        />
      ) : (
        <p>Video is still processing&hellip;</p>
      )}
      <p>{post.caption}</p>
      <p>
        By {post.authorName} {post.locationLabel ? `· ${post.locationLabel}` : ''}
      </p>
      <LikeButton postId={post.id} initiallyLiked={false} />
      <RepostButton postId={post.id} />
      <ReportButton targetType="post" targetId={post.id} />
      <PostEventLauncher postId={post.id} />
      <CommentThread postId={post.id} />
    </article>
  )
}
