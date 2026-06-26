'use client';
import React, { useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { authClient } from '@/lib/auth/client';
import { UserAvatar } from '../UserAvatar';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  testId: string;
  showLiveBadge?: boolean;
}

gsap.registerPlugin(useGSAP);

function HomeIcon(): React.JSX.Element {
  return (
    <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}
function ArticleIcon(): React.JSX.Element {
  return (
    <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}
function TechTalkIcon(): React.JSX.Element {
  return (
    <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  );
}
function ForumIcon(): React.JSX.Element {
  return (
    <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}
function MyArticlesIcon(): React.JSX.Element {
  return (
    <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}
function SettingsIcon(): React.JSX.Element {
  return (
    <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
function LogoutIcon(): React.JSX.Element {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
    </svg>
  );
}

const mainNavItems: NavItem[] = [
  { label: 'Home', href: '/', icon: <HomeIcon />, testId: 'nav-home' },
  { label: 'Articles', href: '/articles', icon: <ArticleIcon />, testId: 'nav-articles' },
  { label: 'Tech Talks', href: '/tech-talks', icon: <TechTalkIcon />, testId: 'nav-tech-talks', showLiveBadge: true },
  { label: 'Forum', href: '/forum', icon: <ForumIcon />, testId: 'nav-forum' },
];
const secondaryNavItems: NavItem[] = [
  { label: 'My Articles', href: '/profile', icon: <MyArticlesIcon />, testId: 'nav-my-articles' },
  { label: 'Settings', href: '/settings', icon: <SettingsIcon />, testId: 'nav-settings' },
];

export function Sidebar(): React.JSX.Element {
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLElement>(null);

  const isActive = (href: string): boolean =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const itemClasses = (href: string): string =>
    isActive(href)
      ? 'sidebar-item sidebar-active relative flex items-center gap-4 pr-4 h-11 rounded cursor-pointer transition-colors text-sm font-medium text-[#CC0000] bg-white/10'
      : 'sidebar-item relative flex items-center gap-4 pr-4 h-11 rounded cursor-pointer transition-colors text-sm font-medium text-[#9CA3AF] hover:bg-white/5 hover:text-white';

  useGSAP(() => {
    // [GSAP] Sidebar Menu load Staggered fade-in + slide-right on initial load (stagger: 0.08s)
    gsap.from('.sidebar-item', {
      x: -20,
      opacity: 0,
      duration: 0.4,
      stagger: 0.08,
      ease: 'power2.out',
    });
  }, { scope: sidebarRef });

  useGSAP(() => {
    // [GSAP] Active sidebar item Transition background & slide-in red indicator (0.2s)
    gsap.from('.active-indicator', {
      x: -5,
      opacity: 0,
      duration: 0.2,
      ease: 'power2.out'
    });
  }, { scope: sidebarRef, dependencies: [pathname] });

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      window.location.href = '/signin'; // Redirect to the sign-in page after sign-out
    } catch (error) {
      console.error('Error during sign-out:', error);
    }
  }

  return (
    <aside ref={sidebarRef} className="fixed left-0 top-0 h-screen min-h-screen w-60 bg-[#1A1A1A] flex flex-col z-20" data-testid="sidebar">
      <div className="pr-4 pt-6 pb-2 sidebar-item" style={{ paddingLeft: '36px' }}>
        <span className="text-xs font-semibold uppercase tracking-widest text-[#6B7280]">Menu</span>
      </div>
      <nav className="flex flex-col px-4 gap-1">
        {mainNavItems.map((item) => (
          <Link key={item.href} href={item.href}
            className={itemClasses(item.href)}
            style={{ paddingLeft: '20px' }}
            data-testid={item.testId}>
            {isActive(item.href) && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-3/4 bg-[#CC0000] active-indicator rounded-r-full" />
            )}
            {item.icon}
            <span className="relative z-10">{item.label}</span>
            {item.showLiveBadge && (
              <span className="relative z-10 ml-auto text-[10px] font-bold bg-[#22C55E] text-white px-1.5 py-0.5 rounded-full">
                LIVE
              </span>
            )}
          </Link>
        ))}
      </nav>
      <div className="border-t border-white/10 my-2 mx-4 sidebar-item" />
      <nav className="flex flex-col px-4 gap-1">
        {secondaryNavItems.map((item) => (
          <Link key={item.href} href={item.href}
            className={itemClasses(item.href)}
            style={{ paddingLeft: '20px' }}
            data-testid={item.testId}>
            {isActive(item.href) && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-3/4 bg-[#CC0000] active-indicator rounded-r-full" />
            )}
            {item.icon}
            <span className="relative z-10">{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="flex-1" />
      <div className="sidebar-item border-t border-white/10 pr-4 py-4 flex items-center gap-3" style={{ paddingLeft: '36px' }}>
        <UserAvatar format='expanded' />
        <button type="submit"
          onClick={handleSignOut}
          className="text-[#6B7280] hover:text-white transition-colors flex-shrink-0"
          data-testid="logout-btn" aria-label="Logout">
          <LogoutIcon />
        </button>
      </div>
    </aside>
  );
}
