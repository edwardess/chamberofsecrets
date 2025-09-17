"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useAuth } from "@/contexts/auth-context";
import { Post } from "@/lib/types";
import { Button } from "@heroui/react";

interface PostModalProps {
  isOpen?: boolean;
  open?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  post?: {
    id?: string;
    title: string;
    content: string;
    createdAt: string;
    tags?: string[];
  };
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function PostModal({ 
  isOpen, 
  open, 
  onClose, 
  onOpenChange, 
  post,
  onEdit,
  onDelete
}: PostModalProps) {
  const { isAdmin } = useAuth();
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const isModalOpen = isOpen || open;
  const handleClose = onClose || (() => onOpenChange?.(false));
  
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        handleClose();
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent scrolling behind modal
      
      // Focus trap initialization
      modalRef.current?.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = ""; // Restore scrolling
    };
  }, [isModalOpen, handleClose]);

  if (!isModalOpen) return null;

  const formatTags = (tags?: string[]) => {
    if (!tags || tags.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span 
            key={tag} 
            className="px-2 py-1 text-xs rounded-full bg-amber-100/90 text-amber-800 font-medium"
          >
            {tag}
          </span>
        ))}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 overflow-hidden"
          ref={modalRef}
          tabIndex={-1}
          role="dialog"
          aria-labelledby="modal-title"
          aria-modal="true"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50"
            onClick={handleClose}
          />

              {/* Modal container */}
              <div className="fixed inset-0 sm:inset-x-0 sm:top-0 sm:pt-10 sm:px-4 md:px-6 lg:px-8 flex justify-center pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ 
                    duration: 0.15, 
                    ease: "easeOut",
                    scale: { duration: 0.1 }
                  }}
                  className="w-full h-full sm:h-auto sm:max-w-3xl md:max-w-4xl lg:max-w-5xl bg-[#F9F9F9] sm:rounded-2xl shadow-xl overflow-hidden pointer-events-auto relative flex flex-col"
                >
                  {/* Close button at the top */}
                  <div className="absolute top-2 right-2 sm:top-2 sm:right-2 z-10">
                    <button
                      onClick={handleClose}
                      className="text-amber-800 hover:text-amber-100 transition-colors p-1.5 sm:p-1 rounded-full hover:bg-amber-800"
                      aria-label="Close"
                    >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

                  {/* Header */}
                  <div className="p-4 sm:p-6 md:p-8 border-b border-amber-100/50">
                    <div className="flex gap-3 sm:gap-4">
                      <div className="flex-shrink-0">
                        <Image 
                          src="https://i.postimg.cc/3WnzmRJh/Copy-of-ka-wfh-PH-8.webp" 
                          alt="Profile" 
                          width={32} 
                          height={32} 
                          className="rounded-full sm:w-10 sm:h-10"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 
                          id="modal-title" 
                          className="text-lg sm:text-xl md:text-2xl font-bold text-amber-900 leading-tight"
                        >
                          {post?.title || "Post Title"}
                        </h2>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <p className="text-xs sm:text-sm text-gray-500">
                            {post?.createdAt || "Created date"}
                          </p>
                          {formatTags(post?.tags)}
                        </div>
                      </div>
                    </div>
                  </div>
              
                  {/* Content - No styling applied to let editor content stand on its own */}
                  <div 
                    className="flex-1 p-4 sm:p-6 md:p-7 overflow-y-auto" 
                    ref={contentRef}
                  >
                    <div 
                      className="max-w-none text-sm sm:text-base"
                      dangerouslySetInnerHTML={{ __html: post?.content || "" }}
                    />
                  </div>
              
                  {/* Footer - Only shown for admins, with Delete button only */}
                  {isAdmin && post?.id && (
                    <div className="flex-shrink-0 p-3 sm:p-4 md:p-6 border-t border-amber-100/50 flex justify-end">
                      <Button
                        color="danger"
                        variant="flat"
                        size="sm"
                        onClick={onDelete}
                        className="text-red-600"
                      >
                        Delete
                      </Button>
                    </div>
                  )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
