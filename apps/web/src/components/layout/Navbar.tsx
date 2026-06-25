'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface NavbarProps {
  notificationCount?: number;
  userInitials?: string;
  userName?: string;
}

gsap.registerPlugin(useGSAP);

export function Navbar({
  notificationCount = 3,
  userInitials = 'ML',
  userName = 'Malindu',
}: NavbarProps): React.JSX.Element {
  const containerRef = useRef<HTMLElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);

  useGSAP(() => {
    // [GSAP] Nav bar: fade-down (y: -20 -> 0, 0.5s)
    gsap.from(containerRef.current, {
      y: -20,
      opacity: 0,
      duration: 0.5,
    });

    // [GSAP] Bell Notification Rubber-band shake on new notification (elastic ease)
    if (notificationCount > 0 && bellRef.current) {
      gsap.fromTo(
        bellRef.current,
        { scaleX: 1.25, scaleY: 0.75 },
        { scaleX: 1, scaleY: 1, duration: 1, ease: 'elastic.out(1, 0.3)', delay: 0.5 }
      );
    }
  }, { scope: containerRef, dependencies: [notificationCount] });

  return (
    <header
      ref={containerRef}
      className="fixed top-0 left-60 right-0 h-16 bg-white border-b border-[#E5E7EB] z-10
                 flex items-center gap-4 px-6"
      data-testid="navbar"
    >
      <div className="flex items-center gap-1.5 flex-shrink-0" data-testid="logo">
        <div className="h-7 px-2 bg-[#CC0000] rounded flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-black leading-none">1BT</span>
        </div>
        <span className="text-[#6B7280] font-semibold text-base leading-none tracking-tight">-WIKI</span>
      </div>

      <div className="flex-1 max-w-xl mx-auto">
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search articles, tech talks..."
            className="w-full !pl-10 pr-4 py-2 bg-[#F5F5F5] border border-[#E5E7EB] rounded-full
                       text-sm text-[#1A1A1A] placeholder:text-[#6B7280]
                       focus:outline-none focus:ring-2 focus:ring-[#CC0000]/20
                       focus:border-[#CC0000] transition-colors"
            data-testid="search-input"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 flex-shrink-0">
        <button
          ref={bellRef}
          type="button"
          className="relative text-[#6B7280] hover:text-[#1A1A1A] transition-colors"
          data-testid="notification-bell"
          aria-label="Notifications"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6 6 0 0 0-5-5.917V4a1 1 0 1 0-2 0v1.083A6 6 0 0 0 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9" />
          </svg>
          {notificationCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[#CC0000] text-white text-[10px] font-bold
                             rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5">
              {notificationCount}
            </span>
          )}
        </button>

        <div className="w-px h-6 bg-[#E5E7EB]" />

        <button
          type="button"
          className="flex items-center gap-2 hover:bg-[#F0F0F0] rounded-lg px-2 py-1 transition-colors"
          data-testid="user-avatar"
        >
          <div className="w-8 h-8 rounded-full bg-[#CC0000] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">{userInitials}</span>
          </div>
          <span className="text-sm font-medium text-[#1A1A1A] hidden md:block">
            {userName}
          </span>
          <svg className="h-3 w-3 text-[#6B7280] ml-1" fill="none" stroke="currentColor"
            strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </header>
  );
}
