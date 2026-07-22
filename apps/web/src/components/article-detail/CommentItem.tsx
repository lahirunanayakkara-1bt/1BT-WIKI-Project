/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import { Comment } from './mock';
import { ConfirmationModal } from '@/components/shared/ConfirmationModal';
import { TrashIcon } from '@/components/shared/icons/TrashIcon';

interface CommentItemProps {
  comment: Comment;
  currentUserName: string;
  onDelete: (id: string) => void;
}

function timeAgo(dateStr: string) {
  const date = new Date(dateStr);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return `${Math.max(0, seconds)} sec ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
}

export function CommentItem({ comment, currentUserName, onDelete }: CommentItemProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMine = comment.authorName === currentUserName;

  const handleDelete = () => {
    // TODO(backend): replace local delete with DELETE 
    // /api/v1/comments/:id via apiFetch() once confirmed.
    onDelete(comment.id);
    setIsModalOpen(false);
  };

  return (
    <div data-testid="comment-item" className="flex gap-4 py-6 border-b border-brand-border last:border-0">
      <img src={comment.authorImage} alt={comment.authorName} className="w-10 h-10 rounded-full bg-brand-border object-cover" />
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <span className="font-semibold text-brand-dark">{comment.authorName}</span>
            <span className="ml-2 text-sm text-brand-text-secondary">{timeAgo(comment.createdAt)}</span>
          </div>
          {isMine && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-brand-text-secondary hover:text-brand-red transition-colors p-1 rounded hover:bg-brand-red/10"
              title="Delete comment"
            >
              <TrashIcon width="16" height="16" />
            </button>
          )}
        </div>
        <p className="mt-2 text-brand-text-primary whitespace-pre-wrap">{comment.content}</p>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        title="Delete this comment?"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
}
