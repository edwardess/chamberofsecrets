"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { useAuth } from "@/contexts/auth-context";
import { Post } from "@/lib/types";
import { deletePost } from "@/lib/posts";

interface AdminControlsProps {
  post?: Post;
  spaceId?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onNew?: () => void;
  className?: string;
}

export default function AdminControls({
  post,
  spaceId,
  onEdit,
  onDelete,
  onNew,
  className = ""
}: AdminControlsProps) {
  const { isAdmin } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  
  // If not admin, don't render anything
  if (!isAdmin) return null;

  // Handle delete with confirmation
  const handleDelete = async () => {
    if (!post) return;
    
    if (window.confirm(`Are you sure you want to delete "${post.title}"?`)) {
      setIsDeleting(true);
      try {
        await deletePost(post.id);
        if (onDelete) onDelete();
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Failed to delete post");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // For post item controls (Edit/Delete)
  if (post) {
    return (
      <div className={`flex gap-1 sm:gap-2 ${className}`}>
        <Button
          color="default"
          variant="flat"
          size="sm"
          onClick={onEdit}
          className="text-blue-600 text-xs sm:text-sm px-2 sm:px-3"
        >
          <span className="hidden xs:inline">Edit</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="xs:hidden">
            <path d="m18 2 4 4-14 14H4v-4L18 2z"/>
          </svg>
        </Button>
        <Button
          color="danger"
          variant="flat"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-xs sm:text-sm px-2 sm:px-3"
        >
          <span className="hidden xs:inline">{isDeleting ? "Deleting..." : "Delete"}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="xs:hidden">
            <polyline points="3,6 5,6 21,6"/>
            <path d="m19,6v14a2,2 0,0 1-2,2H7a2,2 0,0 1-2-2V6m3,0V4a2,2 0,0 1,2-2h4a2,2 0,0 1,2,2v2"/>
          </svg>
        </Button>
      </div>
    );
  }

  // For space header controls (New Post)
  if (spaceId) {
    return (
      <div className={`flex ${className}`}>
        <Button
          color="primary"
          size="sm"
          onClick={onNew}
          className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3"
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
            className="sm:w-4 sm:h-4"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span className="hidden xs:inline">New Post</span>
          <span className="xs:hidden">New</span>
        </Button>
      </div>
    );
  }

  return null;
}











