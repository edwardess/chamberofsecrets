"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SpaceGroup, Group, Space } from "@/lib/types";
import { useAuth } from "@/contexts/auth-context";
import GroupModal from "@/components/admin/group-modal";
import SpaceModal from "@/components/admin/space-modal";
import DeleteGroupModal from "@/components/admin/delete-group-modal";
import DeleteSpaceModal from "@/components/admin/delete-space-modal";
import { Button } from "@heroui/react";

interface AdminSpaceSidebarProps {
  spaceGroups: SpaceGroup[];
  activeSpaceId: string;
  isLoading: boolean;
  onSelectSpace: (spaceId: string) => void;
  onRefresh: () => void; // Callback to refresh data after CRUD operations
  groupLabel?: string;
  spacesLabel?: string;
}

export default function AdminSpaceSidebar({
  spaceGroups,
  activeSpaceId,
  isLoading,
  onSelectSpace,
  onRefresh,
  groupLabel = "Categories",
  spacesLabel = "Spaces"
}: AdminSpaceSidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const { isAdmin } = useAuth();

  // Modal states
  const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState(false);
  const [isEditGroupModalOpen, setIsEditGroupModalOpen] = useState(false);
  const [isDeleteGroupModalOpen, setIsDeleteGroupModalOpen] = useState(false);
  const [isNewSpaceModalOpen, setIsNewSpaceModalOpen] = useState(false);
  const [isEditSpaceModalOpen, setIsEditSpaceModalOpen] = useState(false);
  const [isDeleteSpaceModalOpen, setIsDeleteSpaceModalOpen] = useState(false);
  
  // Selected items for editing/deleting
  const [selectedGroup, setSelectedGroup] = useState<SpaceGroup | null>(null);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);

  // Initialize all groups as expanded
  useEffect(() => {
    if (spaceGroups.length > 0 && Object.keys(expandedGroups).length === 0) {
      const initialExpanded: Record<string, boolean> = {};
      spaceGroups.forEach(group => {
        initialExpanded[group.id] = true;
      });
      setExpandedGroups(initialExpanded);
    }
  }, [spaceGroups, expandedGroups]);

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
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

  const toggleGroupExpansion = (groupId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  // Group actions
  const handleAddGroup = () => {
    setIsNewGroupModalOpen(true);
  };

  const handleEditGroup = (group: SpaceGroup, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedGroup(group);
    setIsEditGroupModalOpen(true);
  };

  const handleDeleteGroup = (group: SpaceGroup, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedGroup(group);
    setIsDeleteGroupModalOpen(true);
  };

  // Space actions
  const handleAddSpace = (groupId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const group = spaceGroups.find(g => g.id === groupId);
    if (group) {
      setSelectedGroup(group);
      setIsNewSpaceModalOpen(true);
    }
  };

  const handleEditSpace = (space: Space, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedSpace(space);
    setIsEditSpaceModalOpen(true);
  };

  const handleDeleteSpace = (space: Space, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedSpace(space);
    setIsDeleteSpaceModalOpen(true);
  };

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
          {isAdmin ? "No groups yet. Add your first group!" : "No spaces available"}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {spaceGroups.map((group) => (
          <div key={group.id} className="space-y-2">
            {/* Group header with admin controls */}
            <div 
              className="flex items-center justify-between cursor-pointer group" 
              onClick={(e) => toggleGroupExpansion(group.id, e)}
            >
              <h3 className="text-sm font-medium text-foreground/70 uppercase tracking-wider flex-grow">
                {group.name}
              </h3>
              
              <div className="flex items-center">
                {/* Admin edit/delete controls for group */}
                {isAdmin && (
                  <div className="flex mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleEditGroup(group, e)}
                      className="p-1 text-foreground/50 hover:text-brown-600"
                      aria-label={`Edit group ${group.name}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button
                      onClick={(e) => handleDeleteGroup(group, e)}
                      className="p-1 text-foreground/50 hover:text-red-600"
                      aria-label={`Delete group ${group.name}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                )}
                
                {/* Expand/collapse button */}
                <button 
                  className="p-1 text-foreground/50 hover:text-foreground/80"
                  aria-label={expandedGroups[group.id] ? "Collapse group" : "Expand group"}
                  onClick={(e) => toggleGroupExpansion(group.id, e)}
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
                    className={`transition-transform ${expandedGroups[group.id] ? "rotate-180" : ""}`}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Spaces list with admin controls */}
            <AnimatePresence>
              {expandedGroups[group.id] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <ul className="space-y-1 ml-2">
                    {group.spaces.map((space) => (
                      <li key={space.id} className="group">
                        <div className="flex items-center">
                          <button
                            onClick={() => onSelectSpace(space.id)}
                            className={`flex-grow text-left px-3 py-2 rounded-lg transition-colors
                              ${activeSpaceId === space.id
                                ? "bg-stone-500 text-white font-medium"
                                : "hover:bg-foreground/5 text-foreground/80"
                              }`}
                            aria-current={activeSpaceId === space.id ? "page" : undefined}
                          >
                            <span>{space.name}</span>
                          </button>
                          
                          {/* Admin edit/delete controls for space */}
                          {isAdmin && (
                            <div className="flex ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => handleEditSpace(space, e)}
                                className="p-1 text-foreground/50 hover:text-orange-600"
                                aria-label={`Edit space ${space.name}`}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                              </button>
                              <button
                                onClick={(e) => handleDeleteSpace(space, e)}
                                className="p-1 text-foreground/50 hover:text-red-600"
                                aria-label={`Delete space ${space.name}`}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                              </button>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                    
                    {/* Add new space button (admin only) */}
                    {isAdmin && (
                      <li>
                        <button
                          onClick={(e) => handleAddSpace(group.id, e)}
                          className="w-full text-left px-3 py-2 mt-1 rounded-lg text-sm text-orange-600 hover:bg-zinc-50 flex items-center gap-1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
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
                          <span>New Space</span>
                        </button>
                      </li>
                    )}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {/* Admin controls for adding new group */}
        {isAdmin && (
          <div className="pt-4 mt-4 border-t border-foreground/10">
            <Button
              color="primary"
              variant="flat"
              size="sm"
              onClick={handleAddGroup}
              className="w-full flex items-center justify-center gap-2"
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
              <span>New Group</span>
            </Button>
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
              {isLoading ? renderSkeletonSpaces() : renderSpaceGroups()}
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
        <div className="sticky top-4 p-4 bg-background/60 backdrop-blur-sm rounded-lg shadow-sm border border-foreground/10">
          <div className="mb-4 pb-3 border-b border-foreground/10">
            <div className="flex items-center gap-2">
              <span className="text-lg">💎</span>
              <div>
                <h1 className="text-lg font-bold text-amber-900 leading-tight">Chamber of Secrets</h1>
                <p className="text-[10px] text-foreground/50 leading-tight">by The WFH Couple</p>
              </div>
            </div>
          </div>
          <h2 className="text-lg font-semibold mb-4">{spacesLabel}</h2>
          {isLoading ? renderSkeletonSpaces() : renderSpaceGroups()}
        </div>
      </div>
      
      {/* Modals */}
      {/* Group Modals */}
      <GroupModal
        isOpen={isNewGroupModalOpen}
        onClose={() => setIsNewGroupModalOpen(false)}
        onSuccess={() => {
          onRefresh();
          setIsNewGroupModalOpen(false);
        }}
        title="Create New Group"
      />
      
      {selectedGroup && (
        <>
          <GroupModal
            isOpen={isEditGroupModalOpen}
            onClose={() => setIsEditGroupModalOpen(false)}
            onSuccess={() => {
              onRefresh();
              setIsEditGroupModalOpen(false);
            }}
            group={{
              id: selectedGroup.id,
              name: selectedGroup.name,
              order: 0 // Default order
            }}
            title={`Edit Group: ${selectedGroup.name}`}
          />
          
          <DeleteGroupModal
            isOpen={isDeleteGroupModalOpen}
            onClose={() => setIsDeleteGroupModalOpen(false)}
            onSuccess={() => {
              onRefresh();
              setIsDeleteGroupModalOpen(false);
            }}
            group={{
              id: selectedGroup.id,
              name: selectedGroup.name,
              order: 0 // Default order
            }}
            groups={spaceGroups.map(group => ({
              id: group.id,
              name: group.name,
              order: 0 // Default order
            }))}
            hasSpaces={selectedGroup.spaces.length > 0}
          />
        </>
      )}
      
      {/* Space Modals */}
      {selectedGroup && (
        <SpaceModal
          isOpen={isNewSpaceModalOpen}
          onClose={() => setIsNewSpaceModalOpen(false)}
          onSuccess={() => {
            onRefresh();
            setIsNewSpaceModalOpen(false);
          }}
          groupId={selectedGroup.id}
          title={`Create New Space in ${selectedGroup.name}`}
        />
      )}
      
      {selectedSpace && (
        <>
          <SpaceModal
            isOpen={isEditSpaceModalOpen}
            onClose={() => setIsEditSpaceModalOpen(false)}
            onSuccess={() => {
              onRefresh();
              setIsEditSpaceModalOpen(false);
            }}
            space={selectedSpace}
            title={`Edit Space: ${selectedSpace.name}`}
          />
          
          <DeleteSpaceModal
            isOpen={isDeleteSpaceModalOpen}
            onClose={() => setIsDeleteSpaceModalOpen(false)}
            onSuccess={() => {
              onRefresh();
              setIsDeleteSpaceModalOpen(false);
            }}
            space={selectedSpace}
          />
        </>
      )}
    </>
  );
}











