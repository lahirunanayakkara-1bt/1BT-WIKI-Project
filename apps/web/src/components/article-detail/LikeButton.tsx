'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
  initialLikeCount: number;
  initialLikedByMe: boolean;
  articleId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function LikeButton({ initialLikeCount, initialLikedByMe, articleId }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLikedByMe);
  const [count, setCount] = useState(initialLikeCount);

  const toggleLike = () => {
    // TODO(backend): replace local toggle with POST/DELETE 
    // /api/v1/articles/:id/like via apiFetch() once Lahiru's likes endpoint 
    // is confirmed. Do not guess the contract.
    setLiked(!liked);
    setCount(prev => liked ? prev - 1 : prev + 1);
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
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={liked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(liked ? 'text-brand-red' : '')}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      {count}
    </button>
  );
}
