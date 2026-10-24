import { useEffect, useState } from 'react';

interface UserAvatarProps {
  name?: string;
  src?: string;
  className?: string;
  imageClassName?: string;
}

export function UserAvatar({ name, src, className = '', imageClassName = '' }: UserAvatarProps) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return (
    <div className={`user-avatar flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-violet-600 via-pink-600 to-orange-400 text-white ${className}`}>
      {src && !failed
        ? <img src={src} alt={`${name || 'User'} avatar`} className={`h-full w-full object-cover ${imageClassName}`} onError={() => setFailed(true)} />
        : <span aria-label={`${name || 'User'} avatar`} className="font-bold">{name?.trim()?.[0]?.toUpperCase() || 'U'}</span>}
    </div>
  );
}
