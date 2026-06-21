// app/post/[id]/page.tsx
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
      <p>
        {post.likeCount} likes · {post.commentCount} comments
      </p>
    </article>
  )
}
