export function Avatar({ name, avatarUrl, size = 28 }: { name: string; avatarUrl?: string | null; size?: number }) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        width={size}
        height={size}
        className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size }}
      />
    )
  }

  const initial = name.trim().charAt(0).toUpperCase() || '?'
  return (
    <span
      aria-hidden="true"
      className="rounded-full bg-teal text-paper font-mono font-semibold flex items-center justify-center shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.45 }}
    >
      {initial}
    </span>
  )
}
