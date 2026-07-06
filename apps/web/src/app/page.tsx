import React from 'react';
import Link from 'next/link';
import { WaveCanvas } from '@/components/landing/WaveCanvas';
import { PageAnimator } from '@/components/landing/PageAnimator';
import { 
  BookOpenIcon, 
  CalendarIcon, 
  MessageSquareIcon, 
  CpuIcon 
} from '@/components/icons/LandingIcons';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-brand-bg)] overflow-x-hidden font-sans">
      <PageAnimator />
      
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[var(--color-brand-dark)]/95 backdrop-blur-md border-b border-white/5 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-sm bg-[var(--color-brand-red)] flex items-center justify-center">
            <span className="text-white text-[12px] font-bold leading-none tracking-tight">1B</span>
          </div>
          <span className="text-white text-lg font-semibold tracking-tight">
            1BT <span className="text-[var(--color-brand-red)]">WIKI</span>
          </span>
        </div>
        <Link 
          href="/signin" 
          data-testid="navbar-signin"
          className="px-5 py-2 rounded-md bg-[var(--color-brand-red)] text-white text-sm font-medium shadow-[0_4px_12px_rgba(204,0,0,0.2)] transition-all duration-300 hover:scale-[1.02] hover:bg-[var(--color-brand-red-hover)] hover:shadow-[0_6px_16px_rgba(204,0,0,0.3)] active:scale-[0.98]"
        >
          Sign In
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative w-full bg-[var(--color-brand-dark)] py-20 lg:py-32 px-6 flex flex-col items-center overflow-hidden">
        <WaveCanvas density="high" />
        
        {/* Decorative Curves */}
        <svg className="absolute right-0 top-0 h-full w-1/3 pointer-events-none hidden lg:block" viewBox="0 0 400 800" fill="none" preserveAspectRatio="none">
          <path d="M400,0 C150,200 150,600 400,800" stroke="var(--color-brand-red)" strokeWidth="1.5" opacity="0.5" />
          <path d="M400,100 C200,250 200,550 400,700" stroke="var(--color-brand-red)" strokeWidth="1" opacity="0.4" />
          <path d="M400,200 C250,300 250,500 400,600" stroke="var(--color-brand-red)" strokeWidth="1" opacity="0.3" />
          <path d="M400,300 C300,350 300,450 400,500" stroke="var(--color-brand-red)" strokeWidth="1" opacity="0.2" />
        </svg>

        <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
          <div className="hero-badge inline-flex items-center gap-2 border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 rounded-full mb-8">
            <span className="w-2 h-2 rounded-full bg-[var(--color-brand-red)] animate-pulse"></span>
            <span className="text-xs uppercase tracking-wider text-[var(--color-brand-text-secondary)] font-medium">
              Internal Portal • Verified 1BT Employees Only
            </span>
          </div>

          <h1 className="hero-headline text-4xl lg:text-[4.5rem] leading-[1.1] font-bold tracking-tight text-white max-w-4xl mb-6">
            Your team's knowledge, <br className="hidden lg:block" />
            <span 
              className="text-[var(--color-brand-red)] inline-block" 
              style={{ textShadow: '0 0 30px rgba(204,0,0,0.3)' }}
            >
              all in one place.
            </span>
          </h1>

          <p className="hero-subtext text-xl leading-relaxed text-white/80 max-w-2xl font-normal">
            Explore what 1BT WIKI has to offer.
          </p>
        </div>
      </section>

      {/* Feature Rows */}
      <section className="bg-[var(--color-brand-bg)] w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 divide-y divide-[var(--color-brand-border)]">
          
          {/* Row 1 - Knowledge Articles */}
          <div className="feature-row flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-12 py-16 lg:py-24 items-center border-none">
            <div className="feature-left lg:col-span-5 flex flex-col items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white border border-[var(--color-brand-border)] flex items-center justify-center shadow-sm mb-2">
                <BookOpenIcon className="w-6 h-6 text-[var(--color-brand-text-primary)]" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-[var(--color-brand-text-primary)]">Knowledge Articles</h2>
              <p className="text-sm lg:text-base leading-relaxed text-[var(--color-brand-text-secondary)]">
                Dive deep into comprehensive guides, project documentation, and standard operating procedures.
              </p>
              <p className="text-sm font-medium text-[var(--color-brand-red)] mt-2">
                Browse markdown guides once signed in &rarr;
              </p>
            </div>
            
            <div className="feature-right lg:col-span-7 w-full">
              <div className="bg-white rounded-xl border border-[var(--color-brand-border)] shadow-sm overflow-hidden flex flex-col">
                {/* Mock Top Bar */}
                <div className="h-12 border-b border-[var(--color-brand-border)] bg-[var(--color-brand-bg)] flex items-center px-4 gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#E5E7EB]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#E5E7EB]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#E5E7EB]"></div>
                  </div>
                  <span className="text-xs uppercase tracking-wider text-[var(--color-brand-text-secondary)] font-medium ml-4">
                    docs/infrastructure/cloud-run-boost.md
                  </span>
                  <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-200">
                    Approved
                  </span>
                </div>
                {/* Mock Content */}
                <div className="p-8 flex flex-col gap-6">
                  <div className="h-6 w-3/4 bg-gray-200 rounded-md"></div>
                  <div className="space-y-3">
                    <div className="h-3 w-full bg-gray-100 rounded"></div>
                    <div className="h-3 w-full bg-gray-100 rounded"></div>
                    <div className="h-3 w-5/6 bg-gray-100 rounded"></div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 space-y-2">
                    <div className="h-2.5 w-1/3 bg-gray-200 rounded"></div>
                    <div className="h-2.5 w-1/2 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2 - Tech Talks Schedule (Alternating) */}
          <div className="feature-row flex flex-col-reverse lg:grid lg:grid-cols-12 gap-8 lg:gap-12 py-16 lg:py-24 items-center">
            <div className="feature-left lg:col-span-7 w-full">
              <div className="bg-white rounded-xl border border-[var(--color-brand-border)] shadow-sm p-6 lg:p-8 flex flex-col gap-6">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs uppercase tracking-wider text-[var(--color-brand-text-secondary)] font-medium">Upcoming Event</span>
                    <div className="h-6 w-64 bg-gray-200 rounded-md"></div>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-bold text-[var(--color-brand-red)] uppercase leading-none">Nov</span>
                    <span className="text-lg font-bold text-[var(--color-brand-text-primary)] leading-none mt-1">14</span>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200"></div>
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-300"></div>
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200"></div>
                  </div>
                  <span className="text-xs font-medium text-[var(--color-brand-text-secondary)] tracking-wide">
                    248 attending
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-[var(--color-brand-border)] pt-4 mt-2">
                  <div className="h-3 w-32 bg-gray-100 rounded"></div>
                  <div className="h-8 w-24 bg-gray-100 rounded-md"></div>
                </div>
              </div>
            </div>
            
            <div className="feature-right lg:col-span-5 flex flex-col items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white border border-[var(--color-brand-border)] flex items-center justify-center shadow-sm mb-2">
                <CalendarIcon className="w-6 h-6 text-[var(--color-brand-text-primary)]" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-[var(--color-brand-text-primary)]">Tech Talks Schedule</h2>
              <p className="text-sm lg:text-base leading-relaxed text-[var(--color-brand-text-secondary)]">
                Stay updated with internal presentations, tech demos, and engineering all-hands meetings.
              </p>
              <p className="text-sm font-medium text-[var(--color-brand-red)] mt-2">
                Register or view talks on the dashboard &rarr;
              </p>
            </div>
          </div>

          {/* Row 3 - Community Forum */}
          <div className="feature-row flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-12 py-16 lg:py-24 items-center">
            <div className="feature-left lg:col-span-5 flex flex-col items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white border border-[var(--color-brand-border)] flex items-center justify-center shadow-sm mb-2">
                <MessageSquareIcon className="w-6 h-6 text-[var(--color-brand-text-primary)]" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-[var(--color-brand-text-primary)]">Community Forum</h2>
              <p className="text-sm lg:text-base leading-relaxed text-[var(--color-brand-text-secondary)]">
                Ask questions, share insights, and discuss ideas with engineers across the company.
              </p>
              <p className="text-sm font-medium text-[var(--color-brand-red)] mt-2">
                Join the conversation once signed in &rarr;
              </p>
            </div>
            
            <div className="feature-right lg:col-span-7 w-full">
              <div className="bg-white rounded-xl border border-[var(--color-brand-border)] shadow-sm p-6 flex flex-col gap-5">
                <div className="flex justify-between items-center border-b border-[var(--color-brand-border)] pb-4">
                  <div className="h-5 w-48 bg-gray-200 rounded"></div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-[var(--color-brand-text-secondary)]">
                    12 Replies
                  </span>
                </div>
                
                {/* Comment 1 */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0"></div>
                  <div className="flex flex-col gap-2 w-full pt-1">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-24 bg-gray-200 rounded"></div>
                      <span className="text-[10px] text-[var(--color-brand-text-secondary)] uppercase tracking-wider">2h ago</span>
                    </div>
                    <div className="h-3 w-[90%] bg-gray-100 rounded"></div>
                  </div>
                </div>

                {/* Comment 2 */}
                <div className="flex gap-4 ml-6">
                  <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0 border border-white"></div>
                  <div className="flex flex-col gap-2 w-full pt-1">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-20 bg-gray-200 rounded"></div>
                      <span className="text-[10px] text-[var(--color-brand-text-secondary)] uppercase tracking-wider">1h ago</span>
                    </div>
                    <div className="h-3 w-[80%] bg-gray-100 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 4 - AI-Powered Quizzes (Alternating) */}
          <div className="feature-row flex flex-col-reverse lg:grid lg:grid-cols-12 gap-8 lg:gap-12 py-16 lg:py-24 items-center border-b border-[var(--color-brand-border)]">
            <div className="feature-left lg:col-span-7 w-full">
              <div className="bg-white rounded-xl border border-[var(--color-brand-border)] shadow-sm p-6 lg:p-8 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
                  <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center shrink-0 border border-yellow-100">
                    <span className="text-[10px]">🏆</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <div className="p-4 border border-[var(--color-brand-border)] rounded-lg bg-white flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border border-gray-300"></div>
                    <div className="h-3 w-1/2 bg-gray-100 rounded"></div>
                  </div>
                  <div className="p-4 border-2 border-[var(--color-brand-red)] rounded-lg bg-red-50 flex items-center gap-3 relative">
                    <div className="w-4 h-4 rounded-full border-4 border-[var(--color-brand-red)]"></div>
                    <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
                    <div className="absolute right-4 text-xs font-bold text-[var(--color-brand-red)] uppercase tracking-wider">Correct</div>
                  </div>
                  <div className="p-4 border border-[var(--color-brand-border)] rounded-lg bg-white flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border border-gray-300"></div>
                    <div className="h-3 w-1/3 bg-gray-100 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="feature-right lg:col-span-5 flex flex-col items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white border border-[var(--color-brand-border)] flex items-center justify-center shadow-sm mb-2">
                <CpuIcon className="w-6 h-6 text-[var(--color-brand-text-primary)]" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-[var(--color-brand-text-primary)]">AI-Powered Quizzes</h2>
              <p className="text-sm lg:text-base leading-relaxed text-[var(--color-brand-text-secondary)]">
                Test your knowledge and stay sharp with AI-generated quizzes based on internal architecture docs.
              </p>
              <p className="text-sm font-medium text-[var(--color-brand-red)] mt-2">
                Unlock certificates upon scoring above 60% &rarr;
              </p>
            </div>
          </div>
          
        </div>
      </section>

      {/* Closing Section */}
      <section className="relative w-full bg-[var(--color-brand-dark)] py-24 lg:py-32 px-6 flex flex-col items-center text-center overflow-hidden">
        <WaveCanvas density="low" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--color-brand-dark)_100%)] pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-white mb-6">
            At 1 Billion Technology, we believe knowledge shared is knowledge multiplied.
          </h2>
          <p className="text-lg lg:text-xl text-[var(--color-brand-text-secondary)] mb-10 font-medium">
            Sign in to start learning, sharing, and growing with your team.
          </p>
          <Link 
            href="/signin" 
            data-testid="footer-signin"
            className="px-8 py-3 rounded-md bg-[var(--color-brand-red)] text-white text-base font-semibold shadow-[0_4px_20px_rgba(204,0,0,0.25)] transition-all duration-300 hover:scale-[1.03] hover:bg-[var(--color-brand-red-hover)] hover:shadow-[0_8px_25px_rgba(204,0,0,0.35)] active:scale-[0.98]"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--color-brand-dark)] border-t border-white/[0.03] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <span className="text-white text-lg font-semibold tracking-tight">
              1BT <span className="text-[var(--color-brand-red)]">WIKI</span>
            </span>
            <span className="hidden md:inline text-[var(--color-brand-text-secondary)]">&bull;</span>
            <p className="text-[13px] text-[var(--color-brand-text-secondary)]">
              &copy; 2026 1 Billion Technology Inc. All rights reserved. For internal distribution only.
            </p>
          </div>
          <div className="text-[11px] uppercase tracking-wider text-[var(--color-brand-text-secondary)] font-medium">
            Version: 2.4.0 <span className="mx-2">|</span> Portal ID: 1BT-WIKI-09
          </div>
        </div>
      </footer>
    </div>
  );
}
