import Link from 'next/link'
import { PostPlusIcon } from '@/components/icons/PostPlusIcon'

export function NewPostButton() {
  return (
    <Link href="/post/new" aria-label="Post what you saw" className="group flex flex-col items-center gap-2 shrink-0">
      <PostPlusIcon className="h-16 w-16 transition-transform group-hover:scale-105" />
      <span className="font-sans text-sm font-semibold text-slate group-hover:text-signal transition-colors">
        Post
      </span>
    </Link>
  )
}
