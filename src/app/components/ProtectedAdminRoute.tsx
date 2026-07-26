import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser, initializeCsrf } from '@/api/authApi';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const [state, setState] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  useEffect(() => {
    let active = true;

    getCurrentUser()
      .then(async user => {
        const isAdmin = user.roles.some(role => role === 'ROLE_ADMIN' || role === 'ROLE_SUPER_ADMIN');
        if (isAdmin) {
          await initializeCsrf();
        }
        if (active) {
          setState(isAdmin ? 'authenticated' : 'unauthenticated');
        }
      })
      .catch(() => {
        if (active) {
          setState('unauthenticated');
        }
      });

    return () => {
      active = false;
    };
  }, []);

  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-600">Loading…</p>
      </div>
    );
  }

  if (state === 'unauthenticated') {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
