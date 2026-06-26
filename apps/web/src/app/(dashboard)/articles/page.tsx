'use client';
import { signOutAction } from '@/actions/signoutAction';
import React from 'react';

export default function ArticlesPage(): React.JSX.Element {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#1A1A1A]">
        Articles
      </h1>
      <p className="text-[#6B7280] mt-2">
        Articles page — coming in MVP 2
      </p>
      <button
        onClick={async () => {
          await signOutAction();
        }}
        className="mt-4 px-4 py-2 bg-[#CC0000] text-white rounded hover:bg-[#B30000] transition"
      >Sign out</button>
    </div>
  );
}
