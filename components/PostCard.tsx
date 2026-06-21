// components/PostCard.tsx
type Post = { id: string; authorName: string; thumbnailUrl: string | null; caption: string | null }

export function PostCard({ post }: { post: Post }) {
  return (
    <a href={`/post/${post.id}`}>
      {post.thumbnailUrl && <img src={post.thumbnailUrl} alt={post.caption ?? ''} />}
      <p>{post.caption}</p>
      <p>By {post.authorName}</p>
    </a>
  )
}
