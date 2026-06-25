// src/app/(dashboard)/layout.tsx
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps): React.JSX.Element {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F5F5]">
      <Sidebar />
      <div className="flex flex-col flex-1 ml-60">
        <Navbar notificationCount={3} userInitials="ML" userName="Malindu" />
        <main className="flex-1 overflow-y-auto pt-16 bg-[#F5F5F5]" data-testid="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
