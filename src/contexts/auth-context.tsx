"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  isAdmin: false,
  signIn: async () => {},
  signOut: async () => {},
});

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      
      // If user is authenticated, they are considered admin
      // In a real app, you might want to check admin claims or roles
      setIsAdmin(!!authUser);
      
      setLoading(false);
    }, (error) => {
      console.error("Auth state change error:", error);
      setError(error.message);
      setIsAdmin(false);
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    setError(null);
    try {
      // Check if Firebase is properly initialized
      if (!auth) {
        const errorMsg = "Firebase authentication is not initialized";
        console.error(errorMsg);
        setError(errorMsg);
        throw new Error(errorMsg);
      }
      
      // Check if running in browser environment
      if (typeof window === 'undefined') {
        const errorMsg = "Authentication cannot run on server side";
        console.error(errorMsg);
        setError(errorMsg);
        throw new Error(errorMsg);
      }
      
      // Attempt sign in
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Sign in error:", error);
      
      // Handle specific Firebase auth errors
      if (error && typeof error === 'object') {
        if ('code' in error) {
          const firebaseError = error as { code: string; message: string };
          
          if (firebaseError.code === 'auth/configuration-not-found') {
            setError("Authentication configuration not found. Please check your Firebase setup in Firebase Console.");
            console.error("Firebase auth configuration not found. Make sure Authentication is enabled in Firebase Console and the web app is properly configured.");
          } else if (firebaseError.code === 'auth/invalid-credential') {
            setError("Invalid email or password");
          } else {
            setError(firebaseError.message || "Authentication failed");
          }
        } else if ('message' in error) {
          setError((error as { message: string }).message);
        } else {
          setError("An unknown error occurred");
        }
      } else {
        setError("An unknown error occurred");
      }
      
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    setError(null);
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
      if (error && typeof error === 'object' && 'message' in error) {
        setError((error as { message: string }).message);
      } else {
        setError("An unknown error occurred");
      }
      throw error;
    }
  };

  const value = {
    user,
    loading,
    error,
    isAdmin,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
