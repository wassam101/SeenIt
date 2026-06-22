type ProfileLike = { display_name?: string | null; is_anonymous?: boolean | null } | null | undefined

export function publicDisplayName(profile: ProfileLike): string {
  if (!profile) return 'Unknown'
  if (profile.is_anonymous) return 'Anonymous'
  return profile.display_name ?? 'Unknown'
}

export function publicAvatarUrl(
  profile: (ProfileLike & { avatar_url?: string | null }) | null | undefined
): string | null {
  if (!profile || profile.is_anonymous) return null
  return profile.avatar_url ?? null
}
