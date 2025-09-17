"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SpaceGroup } from "@/lib/types";
import { useAuth } from "@/contexts/auth-context";

interface SpaceSidebarProps {
  spaceGroups: SpaceGroup[];
  activeSpaceId: string;
  isLoading: boolean;
  onSelectSpace: (spaceId: string) => void;
  groupLabel?: string; // Customizable label for groups
  spacesLabel?: string; // Customizable label for spaces
}

export default function SpaceSidebar({ 
  spaceGroups, 
  activeSpaceId, 
  isLoading, 
  onSelectSpace,
  groupLabel = "Categories",
  spacesLabel = "Spaces" // groupLabel is used in mobile view
}: SpaceSidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const { isAdmin } = useAuth();

  // Initialize all groups as expanded
  useEffect(() => {
    if (spaceGroups.length > 0 && Object.keys(expandedGroups).length === 0) {
      const initialExpanded: Record<string, boolean> = {};
      spaceGroups.forEach(group => {
        initialExpanded[group.name] = true;
      });
      setExpandedGroups(initialExpanded);
    }
  }, [spaceGroups, expandedGroups]);

  // Check if we're on mobile/tablet
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024); // Changed to lg breakpoint (1024px)
    };
    
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  // Close mobile menu when a space is selected
  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [activeSpaceId]); // Removed isMobileMenuOpen from dependency array to prevent infinite loop

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleGroupExpansion = (groupName: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  // Find active space (removed unused functions)

  // Skeleton loader for spaces
  const renderSkeletonSpaces = () => {
    return (
      <>
        {/* Skeleton for group headers */}
        {Array(2).fill(0).map((_, groupIndex) => (
          <div key={`group-${groupIndex}`} className="mb-4">
            <div className="animate-pulse h-5 bg-foreground/10 rounded w-24 mb-3"></div>
            
            {/* Skeleton for spaces */}
            {Array(3).fill(0).map((_, spaceIndex) => (
              <div key={`space-${groupIndex}-${spaceIndex}`} className="animate-pulse mb-2">
                <div className="h-10 bg-foreground/10 rounded-lg"></div>
              </div>
            ))}
          </div>
        ))}
      </>
    );
  };

  const renderSpaceGroups = () => {
    if (spaceGroups.length === 0) {
      return (
        <div className="text-center py-4 text-foreground/60">
          No spaces available
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {spaceGroups.map((group) => (
          <div key={group.name} className="space-y-2">
            {/* Group header */}
            <div 
              className="flex items-center justify-between cursor-pointer" 
              onClick={() => toggleGroupExpansion(group.name)}
            >
              <h3 className="text-xs font-medium text-foreground/70 uppercase tracking-wider">
                {group.name}
              </h3>
              <button 
                className="p-1 text-foreground/50 hover:text-foreground/80"
                aria-label={expandedGroups[group.name] ? "Collapse group" : "Expand group"}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className={`transition-transform ${expandedGroups[group.name] ? "rotate-180" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>
            
            {/* Spaces list */}
            <AnimatePresence>
              {expandedGroups[group.name] && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  {group.spaces.map((space) => (
                    <li key={space.id} className="mt-1">
                      <button
                        onClick={() => onSelectSpace(space.id)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors flex justify-between items-center text-sm ${
                          activeSpaceId === space.id
                            ? "bg-stone-500 text-white font-medium"
                            : "hover:bg-foreground/10 text-foreground/80 hover:text-foreground hover:font-medium"
                        }`}
                      >
                        <span>{space.name}</span>
                        {/* Space post count would go here if available */}
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        ))}

        {/* Admin controls */}
        {isAdmin && (
          <div className="pt-4 mt-4 border-t border-foreground/10">
            <button
              onClick={() => window.location.href = '/admin/spaces/new'}
              className="w-full text-left px-4 py-2.5 rounded-lg transition-colors text-orange-600 hover:bg-stone-50 flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>Add New Space</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  // Mobile hamburger button
  const renderMobileButton = () => {
    return (
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-background shadow-md border border-foreground/10"
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
              className="fixed inset-0 bg-black/30 z-40 lg:hidden"
              onClick={toggleMobileMenu}
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
              className="fixed left-0 top-0 bottom-0 w-80 sm:w-72 bg-background z-50 p-4 shadow-xl lg:hidden overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">💎</span>
                  <div>
                    <h1 className="text-xl font-bold text-amber-900 leading-tight">Chamber of Secrets</h1>
                    <p className="text-[10px] text-foreground/50 leading-tight">by The WFH Couple</p>
                  </div>
                </div>
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
              <div className="mb-6 pb-4 border-b border-foreground/10">
                <h2 className="text-lg font-semibold">{groupLabel}</h2>
              </div>
              {renderSpaceGroups()}
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
      <div className="hidden lg:block w-72 xl:w-80 shrink-0">
        <div className="sticky top-4 p-3 bg-background/60 backdrop-blur-sm rounded-lg shadow-sm border border-foreground/5">
          <div className="mb-4 pb-3 border-b border-foreground/10">
            <div className="flex items-center gap-2">
              <span className="text-lg">💎</span>
              <div>
                <h1 className="text-lg font-bold text-amber-900 leading-tight">Chamber of Secrets</h1>
                <p className="text-[10px] text-foreground/50 leading-tight">by The WFH Couple</p>
              </div>
            </div>
          </div>
          <h2 className="text-base font-semibold mb-3">{spacesLabel}</h2>
          <div className="max-h-[calc(100vh-8rem)] overflow-y-auto">
            {isLoading ? renderSkeletonSpaces() : renderSpaceGroups()}
          </div>
        </div>
      </div>
    </>
  );
}
