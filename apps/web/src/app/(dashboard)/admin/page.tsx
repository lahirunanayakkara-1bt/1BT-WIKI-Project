import React from 'react';
import { RoleGuard } from '@/components/auth/RoleGuard';

export default function AdminDashboardPage(): React.JSX.Element {
  return (
    <RoleGuard allowedRoles={['Admin']}>
      <div className="p-8">
        <h1 className="text-2xl font-semibold text-brand-text-primary">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-brand-text-secondary text-sm">
          Welcome to the admin area. This page is protected by RoleGuard.
        </p>
      </div>
    </RoleGuard>
  );
}
