"use client";

import { Button } from "@heroui/react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const { user, isAdmin, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleLogin = () => {
    router.push("/admin/login");
  };

  return (
    <header className="bg-white border-b border-foreground/10 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-foreground">FAQ Hub</Link>
        
        <div className="flex items-center gap-4">
          {isAdmin ? (
            <>
              <span className="text-sm text-foreground/70 hidden sm:inline">
                {user?.email}
              </span>
              <Button 
                color="default" 
                variant="flat" 
                size="sm"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button 
              color="default" 
              variant="flat" 
              size="sm"
              onClick={handleLogin}
            >
              Admin Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}













