'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { HeartIcon } from '@/components/shared/icons/HeartIcon';

interface LikeButtonProps {
  initialLikeCount: number;
  initialLikedByMe: boolean;
  articleId: string;
}

export function LikeButton({
  initialLikeCount,
  initialLikedByMe,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLikedByMe);
  const [count, setCount] = useState(initialLikeCount);

  const toggleLike = () => {
    // TODO(backend): replace local toggle with POST/DELETE
    // /api/v1/articles/:id/like via apiFetch() once Lahiru's likes endpoint
    // is confirmed. Do not guess the contract.
    setLiked(!liked);
    setCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <button
      onClick={toggleLike}
      data-testid="like-button"
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-full border transition-colors font-medium',
        liked
          ? 'bg-brand-red/10 border-brand-red text-brand-red'
          : 'bg-brand-surface border-brand-border text-brand-text-secondary hover:bg-brand-hover hover:text-brand-dark'
      )}
    >
      <HeartIcon
        fill={liked ? 'currentColor' : 'none'}
        className={cn(liked ? 'text-brand-red' : '')}
      />
      {count}
    </button>
  );
}
