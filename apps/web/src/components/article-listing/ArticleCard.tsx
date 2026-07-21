import React from 'react';
import Link from 'next/link';
import { HeartIcon } from '@/components/shared/icons/HeartIcon';
import { CommentIcon } from '@/components/shared/icons/CommentIcon';
import { EyeIcon } from '@/components/shared/icons/EyeIcon';

interface ArticleCardProps {
  id: string;
  title: string;
  tags: string[];
  likeCount: number;
  commentCount: number;
  createdAt: string;
}

export function ArticleCard({
  id,
  title,
  tags,
  likeCount,
  commentCount,
  createdAt,
}: ArticleCardProps): React.JSX.Element {
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link
      href={`/articles/${id}`}
      data-testid={`article-card-${id}`}
      className="flex flex-col gap-4 p-6 bg-white border border-[#E5E7EB] rounded-lg hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex flex-col gap-2 flex-grow">
        <h2 className="text-xl font-semibold text-[#1A1A1A] line-clamp-2">{title}</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs font-medium text-[#4B5563] bg-[#F3F4F6] rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 text-sm text-[#6B7280]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1" data-testid="article-like-count">
            <HeartIcon width="16" height="16" />
            <span>{likeCount}</span>
          </div>
          <div className="flex items-center gap-1" data-testid="article-comment-count">
            <CommentIcon width="16" height="16" />
            <span>{commentCount}</span>
          </div>
          {/* TODO(backend): wire real view count once the views field is exposed by GET /api/v1/articles */}
          <div className="flex items-center gap-1 opacity-50 cursor-not-allowed" data-testid="article-view-count" title="View count coming soon">
            <EyeIcon width="16" height="16" />
            <span>—</span>
          </div>
        </div>
        <span>{formattedDate}</span>
      </div>
    </Link>
  );
}
