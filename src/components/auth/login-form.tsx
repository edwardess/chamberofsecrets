"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Input, Button, Spinner } from "@heroui/react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !password) {
      setErrorMessage("Please enter both email and password");
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage("");
    
    try {
      await signIn(email, password);
      router.push("/"); // Redirect to main public page instead of admin dashboard
    } catch (error) {
      // Format error message for user-friendly display
      let message = "Failed to sign in";
      
      // Type guard for Firebase Auth errors
      if (error && typeof error === 'object' && 'code' in error) {
        const firebaseError = error as { code: string; message?: string };
        
        if (firebaseError.code === "auth/invalid-credential" || 
            firebaseError.code === "auth/user-not-found" || 
            firebaseError.code === "auth/wrong-password") {
          message = "Invalid email or password";
        } else if (firebaseError.code === "auth/too-many-requests") {
          message = "Too many failed login attempts. Please try again later";
        } else if (firebaseError.message) {
          message = firebaseError.message;
        }
      }
      
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@example.com"
          required
          className="w-full"
          disabled={isSubmitting}
          aria-describedby="email-error"
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
          Password
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="w-full"
          disabled={isSubmitting}
          aria-describedby="password-error"
        />
      </div>
      
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm" role="alert">
          {errorMessage}
        </div>
      )}
      
      <Button 
        type="submit" 
        className="w-full" 
        color="primary"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Spinner size="sm" className="mr-2" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  );
}
