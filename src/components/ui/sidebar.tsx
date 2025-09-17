"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Category {
  name: string;
  count: number;
}

interface SidebarProps {
  categories: Category[];
  activeCategory: string;
  isLoading: boolean;
  onSelectCategory: (category: string) => void;
}

export default function Sidebar({ 
  categories, 
  activeCategory, 
  isLoading, 
  onSelectCategory 
}: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  // Close mobile menu when a category is selected
  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [activeCategory, isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Skeleton loader for categories
  const renderSkeletonCategories = () => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="h-10 bg-foreground/10 rounded-lg mb-2"></div>
        </div>
      ));
  };

  const renderCategories = () => {
    return (
      <ul className="space-y-1">
        {categories.map((category) => (
          <li key={category.name}>
            <button
              onClick={() => onSelectCategory(category.name)}
              className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors flex justify-between items-center ${
                activeCategory === category.name
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "hover:bg-foreground/5 text-foreground/80"
              }`}
            >
              <span>{category.name}</span>
              <span className="text-xs bg-foreground/10 text-foreground/60 rounded-full px-2 py-0.5">
                {category.count}
              </span>
            </button>
          </li>
        ))}
      </ul>
    );
  };

  // Mobile hamburger button
  const renderMobileButton = () => {
    return (
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-background shadow-md"
        aria-label="Toggle menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isMobileMenuOpen ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </>
          ) : (
            <>
              <line x1="4" y1="12" x2="20" y2="12"></line>
              <line x1="4" y1="6" x2="20" y2="6"></line>
              <line x1="4" y1="18" x2="20" y2="18"></line>
            </>
          )}
        </svg>
      </button>
    );
  };

  // Mobile drawer
  const renderMobileDrawer = () => {
    return (
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40 md:hidden"
              onClick={toggleMobileMenu}
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-background z-50 p-4 shadow-xl md:hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Categories</h2>
                <button onClick={toggleMobileMenu} className="p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              {isLoading ? renderSkeletonCategories() : renderCategories()}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  };

  return (
    <>
      {/* Mobile hamburger button */}
      {isMobile && renderMobileButton()}
      
      {/* Mobile drawer */}
      {isMobile && renderMobileDrawer()}
      
      {/* Desktop sidebar */}
      <div className="hidden md:block w-64 shrink-0">
        <div className="sticky top-4 p-4 bg-background/60 backdrop-blur-sm rounded-lg shadow-sm border border-foreground/10">
          <h2 className="text-lg font-semibold mb-4">Categories</h2>
          {isLoading ? renderSkeletonCategories() : renderCategories()}
        </div>
      </div>
    </>
  );
}
