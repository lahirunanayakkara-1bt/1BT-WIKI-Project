/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';
import { mockArticles } from '@/components/article-detail/mock';
import { ArticleContent } from '@/components/article-detail/ArticleContent';
import { LikeButton } from '@/components/article-detail/LikeButton';
import { CommentsSection } from '@/components/article-detail/CommentsSection';
import { ArrowLeftIcon } from '@/components/shared/icons/ArrowLeftIcon';

// TODO(backend): replace mock lookup with a real GET /api/v1/articles/:id
// call via apiFetch() from '@/lib/api/client' once the endpoint is
// confirmed (Chathurika's KB-01 territory). Do not guess the DTO shape.

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function ArticleDetailPage(props: ArticlePageProps) {
  const params = await props.params;
  // Fall back to a single mock article if id doesn't match
  const article = mockArticles[params.id] || mockArticles['1']!;

  if (!article) {
    return <div>Article not found</div>;
  }

  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
      <div className="mb-6">
        <Link href="/articles" className="inline-flex items-center text-sm font-medium text-brand-text-secondary hover:text-brand-red transition-colors">
          <ArrowLeftIcon width="16" height="16" className="mr-1" />
          Back to Articles
        </Link>
      </div>

      <article className="bg-brand-surface rounded-xl shadow-sm border border-brand-border overflow-hidden">
        <div className="p-8 md:p-12 pb-6 border-b border-brand-border">
          <div className="flex flex-wrap gap-2 mb-6">
            {article.tags.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full bg-brand-bg text-brand-text-secondary text-xs font-semibold uppercase tracking-wider">
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-dark leading-tight mb-8">
            {article.title}
          </h1>
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <img src={article.author.avatarUrl} alt={article.author.name} className="w-12 h-12 rounded-full object-cover bg-brand-border" />
              <div>
                <p className="font-semibold text-brand-dark">{article.author.name}</p>
                <p className="text-sm text-brand-text-secondary">{formattedDate}</p>
              </div>
            </div>
            <LikeButton 
              articleId={article.id}
              initialLikeCount={article.likeCount} 
              initialLikedByMe={article.likedByMe} 
            />
          </div>
        </div>
        
        <div className="p-8 md:p-12 bg-white">
          <ArticleContent body={article.body} />
        </div>
      </article>

      <CommentsSection articleId={params.id} />
    </div>
  );
}
