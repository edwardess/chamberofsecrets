"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import LoginForm from "@/components/auth/login-form";
import { Spinner } from "@heroui/react";

export default function AdminLoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user && !loading) {
      router.replace("/admin/dashboard");
    }
  }, [user, loading, router]);
  
  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }
  
  // If not logged in, show login form
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 bg-foreground/5 rounded-lg shadow-sm border border-foreground/10">
          <h1 className="text-2xl font-bold text-foreground mb-6 text-center">
            Admin Login
          </h1>
          <LoginForm />
        </div>
      </div>
    );
  }
  
  // This should never be shown as the useEffect will redirect
  return null;
}
