/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import { Comment, mockCommentsData, mockUser } from './mock';
import { CommentItem } from './CommentItem';
import { Toast } from '@/components/shared/Toast';

export function CommentsSection() {
  const [comments, setComments] = useState<Comment[]>(mockCommentsData);
  const [newComment, setNewComment] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // TODO(backend): replace local append with POST /api/v1/articles/:id/comments
    // via apiFetch() once Lahiru's comments endpoint is confirmed.

    const comment: Comment = {
      id: `new-${Date.now()}`,
      author: mockUser, // mock current user
      content: newComment.trim(),
      createdAt: new Date().toISOString(),
    };

    setComments([comment, ...comments]);
    setNewComment('');

    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  const handleDeleteComment = (id: string) => {
    setComments(comments.filter(c => c.id !== id));
  };

  return (
    <div className="mt-12 bg-brand-surface rounded-xl shadow-sm border border-brand-border p-6 md:p-8">
      <h3 className="text-xl font-display font-bold text-brand-dark mb-6">
        Comments ({comments.length})
      </h3>

      <form onSubmit={handlePostComment} className="mb-8 flex gap-4">
        <img src={mockUser.avatarUrl} alt={mockUser.name} className="w-10 h-10 rounded-full bg-brand-border hidden sm:block object-cover" />
        <div className="flex-1 flex flex-col items-end gap-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full bg-brand-bg border border-brand-border rounded-lg p-4 text-brand-text-primary 
            placeholder:text-brand-text-secondary focus:outline-none focus:border-brand-red resize-none min-h-[100px] transition-colors"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="px-6 py-2.5 bg-brand-dark text-brand-surface font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed 
            hover:bg-brand-red transition-colors"
          >
            Post Comment
          </button>
        </div>
      </form>

      <div className="flex flex-col">
        {comments.map(comment => (
          <CommentItem
            key={comment.id}
            comment={comment}
            currentUserName={mockUser.name}
            onDelete={handleDeleteComment}
          />
        ))}
        {comments.length === 0 && (
          <p className="text-brand-text-secondary text-center py-8">No comments yet. Be the first to share your thoughts!</p>
        )}
      </div>

      <Toast
        visible={toastVisible}
        message="Comment posted"
        type="success"
      />
    </div>
  );
}
