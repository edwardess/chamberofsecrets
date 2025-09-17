"use client";

import { useEffect, useRef, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FocusTrap from "./focus-trap";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  description?: string;
  maxWidth?: string;
}

export default function CustomModal({
  isOpen,
  onClose,
  children,
  title,
  description,
  maxWidth = "max-w-[850px]"
}: CustomModalProps) {
  const previousFocusRef = useRef<Element | null>(null);
  
  // Store the previously focused element
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      // Prevent body scrolling when modal is open
      document.body.style.overflow = "hidden";
    } else {
      // Restore body scrolling when modal is closed
      document.body.style.overflow = "";
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  
  // Handle escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
            aria-hidden="true"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 sm:flex sm:items-center sm:justify-center z-50 sm:p-4 overflow-y-auto">
            <FocusTrap isActive={isOpen} onEscape={onClose}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className={`bg-background sm:rounded-2xl shadow-xl ${maxWidth} w-full h-full sm:h-auto sm:mx-auto overflow-hidden flex flex-col`}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? "modal-title" : undefined}
                aria-describedby={description ? "modal-description" : undefined}
                onClick={(e) => e.stopPropagation()}
              >
                {title && (
                  <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-foreground/10">
                    <h2 id="modal-title" className="text-lg sm:text-xl font-bold">{title}</h2>
                    {description && (
                      <p id="modal-description" className="sr-only">{description}</p>
                    )}
                  </div>
                )}
                
                <div className="overflow-y-auto flex-1 sm:max-h-[calc(90vh-8rem)]">
                  {children}
                </div>
                
                <button
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-full hover:bg-foreground/10 active:bg-foreground/20 transition-colors"
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-5 sm:h-5">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </motion.div>
            </FocusTrap>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}







