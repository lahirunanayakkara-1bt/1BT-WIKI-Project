'use client';
import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ARTICLES = [
  {
    id: 1,
    category: 'DEVOPS',
    title: 'Optimizing Next.js SSR caching on Kubernetes',
    excerpt: 'How we achieved a 45% reduction in TTFB and reduced pod CPU utilization by caching server-rendered pages at the ingress controller layer.',
    authorInitials: 'SC',
    authorName: 'Sarah Connor',
    date: 'Jun 24, 2026',
    readTime: '6 min read',
    likes: 42,
    comments: 8,
  },
  {
    id: 2,
    category: 'FRONTEND',
    title: 'A Guide to React 19 Compiler and Server Actions',
    excerpt: 'An in-depth review of React compiler optimization benefits, eliminating useMemo/useCallback, and how we are using safe server actions.',
    authorInitials: 'ER',
    authorName: 'Elena Rostova',
    date: 'Jun 22, 2026',
    readTime: '8 min read',
    likes: 56,
    comments: 14,
  },
  {
    id: 3,
    category: 'DEVOPS',
    title: 'Continuous Delivery patterns for high-frequency deployment',
    excerpt: 'Draft outline of our upcoming pipeline overhaul. Transitioning from automated nightlies to safe, blue-green deployment rings.',
    authorInitials: 'ML',
    authorName: 'Malindu',
    date: 'Jun 25, 2026',
    readTime: '4 min read',
    likes: 0,
    comments: 0,
    statusBadge: 'DRAFT',
  },
  {
    id: 4,
    category: 'BACKEND',
    title: 'Migrating core transaction storage to Cloud Spanner',
    excerpt: 'A retrospective on the database migration that unlocked external consistency and global scale for our payment backend with zero minutes of downtime.',
    authorInitials: 'MA',
    authorName: 'Marcus Aurelius',
    date: 'Jun 18, 2026',
    readTime: '12 min read',
    likes: 89,
    comments: 22,
  },
  {
    id: 5,
    category: 'SECURITY',
    title: 'Securing API endpoints with OAuth2 and JWKS',
    excerpt: 'Pending peer review. Proposed standard for all microservices in the 1BT environment. Configuration details for Auth0 and private keys.',
    authorInitials: 'JD',
    authorName: 'John Doe',
    date: 'Jun 17, 2026',
    readTime: '10 min read',
    likes: 4,
    comments: 2,
    statusBadge: 'PENDING',
  },
  {
    id: 6,
    category: 'AI & ML',
    title: 'Applying LLM Tool Calling for database ops',
    excerpt: 'Practical patterns for integrating Gemini model tool definitions with SQL generators, while keeping user permissions and input validation airtight.',
    authorInitials: 'KT',
    authorName: 'Kai Takahashi',
    date: 'Jun 15, 2026',
    readTime: '7 min read',
    likes: 121,
    comments: 31,
  }
];

export default function ArticlesPage(): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // [GSAP] ScrollTrigger Article Cards: Staggered fade-up entry animation on scroll (y: 30 -> 0, opacity: 0 -> 1, stagger: 0.1s).
    const cards = gsap.utils.toArray('.article-card');
    
    gsap.from(cards, {
      scrollTrigger: {
        trigger: '.cards-grid',
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out'
    });

    // [GSAP] Card Hover Interaction: Smooth custom shadow deepening on cursor enter
    cards.forEach((card: any) => {
      const enterAnim = gsap.to(card, {
        y: -4,
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
        duration: 0.15,
        ease: 'power2.out',
        paused: true
      });

      card.addEventListener('mouseenter', () => enterAnim.play());
      card.addEventListener('mouseleave', () => enterAnim.reverse());
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="p-8">
      {/* Header section */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Knowledge Base</h1>
          <p className="text-[#6B7280] text-sm mt-1 max-w-2xl">
            Explore software engineering articles, infrastructure logs, and guidelines shared by your team.
          </p>
        </div>
        <button
          type="button"
          className="bg-[#CC0000] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#A80000] transition-colors"
          data-testid="create-article-btn"
        >
          + Create Article
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center justify-between mb-8 border-b border-[#E5E7EB] pb-4">
        <div className="flex items-center gap-2">
          <button type="button" className="bg-[#CC0000] text-white rounded-full px-4 py-1 text-sm font-medium" data-testid="filter-all">
            All
          </button>
          <button type="button" className="text-[#6B7280] hover:bg-[#F0F0F0] rounded-full px-4 py-1 text-sm font-medium transition-colors" data-testid="filter-published">
            Published
          </button>
          <button type="button" className="text-[#6B7280] hover:bg-[#F0F0F0] rounded-full px-4 py-1 text-sm font-medium transition-colors" data-testid="filter-draft">
            Draft
          </button>
          <button type="button" className="text-[#6B7280] hover:bg-[#F0F0F0] rounded-full px-4 py-1 text-sm font-medium transition-colors" data-testid="filter-pending">
            Pending
          </button>
        </div>
        <span className="text-[#6B7280] text-sm font-medium">Showing 6 of 6 total articles</span>
      </div>

      {/* Article grid */}
      <div className="grid grid-cols-2 gap-4 cards-grid">
        {ARTICLES.map((article) => (
          <div
            key={article.id}
            className="article-card bg-white rounded-lg p-5 border border-[#E5E7EB] flex flex-col"
            data-testid="article-card"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="bg-[#CC0000]/10 text-[#CC0000] text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded">
                {article.category}
              </span>
              {article.statusBadge && (
                <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded
                  ${article.statusBadge === 'DRAFT' ? 'bg-[#FEF3C7] text-[#D97706]' : 'bg-[#DBEAFE] text-[#2563EB]'}`}>
                  {article.statusBadge}
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-[#1A1A1A] mb-2">{article.title}</h2>
            <p className="text-[#6B7280] text-sm mb-4 line-clamp-2 flex-1 leading-relaxed">
              {article.excerpt}
            </p>
            
            {/* Bottom Row */}
            <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB] mt-auto">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#1A1A1A] flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">{article.authorInitials}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-[#1A1A1A]">{article.authorName}</span>
                  <span className="text-[10px] text-[#6B7280]">{article.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[#6B7280]">
                <div className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs">{article.readTime}</span>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="text-xs">{article.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="text-xs">{article.comments}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
