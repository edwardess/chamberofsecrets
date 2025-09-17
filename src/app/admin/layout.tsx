"use client";

import ProtectedRoute from "@/components/auth/protected-route";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Special case for login page - don't apply ProtectedRoute
  const isLoginPage = typeof window !== 'undefined' && window.location.pathname.includes('/admin/login');
  
  if (isLoginPage) {
    return <>{children}</>;
  }

  // For all other admin routes, use ProtectedRoute
  // This will redirect to login if not authenticated
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
