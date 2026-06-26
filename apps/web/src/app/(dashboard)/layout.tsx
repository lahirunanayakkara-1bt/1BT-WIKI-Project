'use client';

import React, { useState, useRef } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps): React.JSX.Element {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const mainWrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const sidebar = document.querySelector('[data-testid="sidebar"]');
    const navbar = document.querySelector('[data-testid="navbar"]');
    const mainWrapper = mainWrapperRef.current;

    if (!sidebar || !navbar || !mainWrapper) return;

    if (isSidebarOpen) {
      // Slide sidebar IN
      gsap.to(sidebar, {
        x: 0,
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
      });
      // Slide navbar and main content area to make space
      gsap.to(navbar, {
        left: 240,
        duration: 0.4,
        ease: 'power2.out',
      });
      gsap.to(mainWrapper, {
        marginLeft: 240,
        duration: 0.4,
        ease: 'power2.out',
      });

      // Stagger-in the sidebar navigation links
      gsap.fromTo('.sidebar-item',
        { x: -15, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.3, stagger: 0.04, ease: 'power2.out', delay: 0.05 }
      );
    } else {
      // Slide sidebar OUT
      gsap.to(sidebar, {
        x: -240,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.inOut',
      });
      // Slide navbar and main content area to full width
      gsap.to(navbar, {
        left: 0,
        duration: 0.4,
        ease: 'power2.inOut',
      });
      gsap.to(mainWrapper, {
        marginLeft: 0,
        duration: 0.4,
        ease: 'power2.inOut',
      });
    }
  }, { dependencies: [isSidebarOpen] });

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F5F5]">
      <Sidebar />
      <div ref={mainWrapperRef} className="flex flex-col flex-1 ml-60">
        <Navbar
          notificationCount={3}
          userInitials="ML"
          userName="Malindu"
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={toggleSidebar}
        />
        <main className="flex-1 overflow-y-auto pt-16 bg-[#F5F5F5]" data-testid="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}

