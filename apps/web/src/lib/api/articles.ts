import { apiFetch } from '@/lib/api/client';

export type ArticleStatus = 'Draft' | 'Pending' | 'Published' | 'Unpublished';

export interface ArticleListItem {
  id: string;
  title: string;
  authorId: string;
  tags: string[];
  status: ArticleStatus;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  commentCount: number;
}

export interface ListMineResult {
  articles: ArticleListItem[];
  total: number;
  page: number;
  limit: number;
}

export async function fetchMyArticles(page = 1, limit = 20): Promise<ListMineResult> {
  const result = await apiFetch<ListMineResult>(`/articles/mine?page=${page}&limit=${limit}`);
  if (!result.success || !result.data) {
    throw new Error(result.error || 'Failed to load articles');
  }
  return result.data;
}
