interface UserAvatarProps {
  avatarUrl?: string
  username?: string
  email?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'size-8',
  md: 'size-10',
  lg: 'size-12',
}

export function UserAvatar({
  avatarUrl,
  username,
  email,
  size = 'md',
}: UserAvatarProps) {
  const displayName = username || email
  const initial = displayName?.[0].toUpperCase() || '?'

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={displayName || 'User avatar'}
        className={`${sizeClasses[size]} rounded-full object-cover border border-border`}
      />
    )
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm border border-border`}
    >
      {initial}
    </div>
  )
}
