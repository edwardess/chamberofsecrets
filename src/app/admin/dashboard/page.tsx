"use client";

import { useAuth } from "@/contexts/auth-context";
import { Button } from "@heroui/react";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Admin Dashboard
        </h1>
        <Button 
          color="primary"
          as="a" 
          href="/admin/dashboard/new"
        >
          New Post
        </Button>
      </div>
      
      <div className="p-6 bg-foreground/5 rounded-lg border border-foreground/10">
        <h2 className="text-xl font-semibold mb-4">Welcome, {user?.email}</h2>
        <p className="text-foreground/70 mb-4">
          You are now logged in to the admin dashboard. From here, you can manage your FAQ posts.
        </p>
        <p className="text-foreground/70">
          Post management functionality will be implemented in Phase 7-9.
        </p>
      </div>
    </div>
  );
}
