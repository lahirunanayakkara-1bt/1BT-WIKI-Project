import { JSONContent } from '@tiptap/react';

export interface User {
  name: string;
  avatarUrl: string;
}

export interface Article {
  id: string;
  title: string;
  author: User;
  publishedAt: string;
  tags: string[];
  body: JSONContent;
  likeCount: number;
  likedByMe: boolean;
}

export interface Comment {
  id: string;
  authorName: string;
  authorImage: string;
  content: string;
  createdAt: string;
}

export const mockUser: User = {
  name: 'Jane Doe',
  avatarUrl: 'https://i.pravatar.cc/150?u=jane',
};

export const mockArticles: Record<string, Article> = {
  '1': {
    id: '1',
    title: 'The Future of Web Development',
    author: mockUser,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    tags: ['React', 'Next.js', 'Frontend'],
    body: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: 'The Future of Web Development' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Web development is constantly evolving. In this article, we explore the latest trends and practices...' }],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'A New Era' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'With the advent of Next.js App Router, the way we build React applications has fundamentally changed.' }],
        }
      ],
    },
    likeCount: 42,
    likedByMe: false,
  },
};

export const mockCommentsData: Comment[] = [
  {
    id: 'c1',
    authorName: 'John Smith',
    authorImage: 'https://i.pravatar.cc/150?u=john',
    content: 'Great read! Thanks for sharing.',
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
  },
  {
    id: 'c2',
    authorName: 'Alice Johnson',
    authorImage: 'https://i.pravatar.cc/150?u=alice',
    content: 'I completely agree with the points made here.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
];
