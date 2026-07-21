'use client';
import React from 'react';
import Link from 'next/link';

export default function ArticlesPage(): React.JSX.Element {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#1A1A1A]">
        Articles
      </h1>
      <p className="text-[#6B7280] mt-2 mb-4">
        Articles page — coming in MVP 2
      </p>
      <Link href="/articles/1" className="text-brand-red hover:underline">
        Test Mock Article Detail Page
      </Link>
    </div>
  );
}
