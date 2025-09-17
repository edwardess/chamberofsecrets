"use client";

import { useState, useEffect } from "react";
import { Post } from "@/lib/types";
import PostModal from "@/components/post-modal";
import AdminControls from "@/components/admin/admin-controls";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { incrementHearts } from "@/lib/posts";

interface PostCardProps {
  post: Post;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function PostCard({ post, onEdit, onDelete }: PostCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHeartDisabled, setIsHeartDisabled] = useState(false);
  const [heartCount, setHeartCount] = useState(post.hearts || 0);
  const { isAdmin } = useAuth();
  const router = useRouter();
  
  // Check if heart button should be disabled based on localStorage
  function checkHeartDisabled() {
    if (typeof window === 'undefined') return false; // Server-side rendering check
    
    const lastHeartTime = localStorage.getItem(`heart_${post.id}`);
    if (lastHeartTime) {
      const timeDiff = Date.now() - parseInt(lastHeartTime);
      const fourHoursInMs = 4 * 60 * 60 * 1000;
      return timeDiff < fourHoursInMs;
    }
    return false;
  }

  // Initialize heart disabled state on client side only
  useEffect(() => {
    setIsHeartDisabled(checkHeartDisabled());
  }, [post.id]);

  // Format date
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(post.createdAt);

  // Create a truncated preview of the content
  const createPreview = (html: string) => {
    if (typeof window === 'undefined') {
      // Server-side: strip HTML tags and truncate
      const text = html.replace(/<[^>]*>/g, '');
      return text.length > 160 ? text.substring(0, 160) + "..." : text;
    }
    
    // Client-side: Create a temporary div to parse HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    
    // Get text content and truncate
    const text = tempDiv.textContent || tempDiv.innerText || "";
    return text.length > 160 ? text.substring(0, 160) + "..." : text;
  };

  // Handle edit button click
  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    }
  };

  // Handle post deletion
  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };
  
  
  // Handle heart click
  const handleHeartClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the modal
    
    if (isHeartDisabled) return;
    
    try {
      // Update UI immediately
      setHeartCount(prevCount => prevCount + 1);
      setIsHeartDisabled(true);
      
      // Store the current time in localStorage
      localStorage.setItem(`heart_${post.id}`, Date.now().toString());
      
      // Update Firestore
      await incrementHearts(post.id);
      
      // Set a timeout to re-enable the heart button after 4 hours
      setTimeout(() => {
        setIsHeartDisabled(false);
      }, 4 * 60 * 60 * 1000); // 4 hours in milliseconds
    } catch (error) {
      console.error('Error incrementing heart count:', error);
      // Revert UI changes if the update fails
      setHeartCount(prevCount => prevCount - 1);
      setIsHeartDisabled(false);
    }
  };

  return (
    <>
      <div className="border-b border-foreground/40 p-3 sm:p-4 hover:bg-foreground/3 transition-colors">
        <div className="flex gap-3 items-start">
          {/* Profile image on the left */}
          <div className="relative flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 mt-0.5 sm:mt-1 rounded-full overflow-hidden">
            <Image 
              src="https://i.postimg.cc/3WnzmRJh/Copy-of-ka-wfh-PH-8.webp" 
              alt="Profile" 
              width={40} 
              height={40}
              className="object-cover"
            />
          </div>
          
          <div 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 cursor-pointer min-w-0"
          >
            <h3 className="text-sm sm:text-base font-medium mb-1 sm:mb-1.5 line-clamp-2 leading-tight">{post.title}</h3>
            <div className="flex items-center text-xs sm:text-xs text-foreground/70">
              <span className="font-medium">The WFH Couple</span>
              <span className="hidden xs:inline"> posted </span>
              <span className="xs:hidden"> • </span>
              <span>{formattedDate}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Heart button */}
            <button 
              onClick={handleHeartClick}
              disabled={isHeartDisabled}
              className={`flex items-center gap-1 group cursor-pointer`}
              aria-label={isHeartDisabled ? "Already liked" : "Like this post"}
            >
              <span 
                className={`transition-transform ${!isHeartDisabled ? 'group-hover:scale-110 group-active:scale-125' : ''} duration-200`}
              >
                {isHeartDisabled ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#ff5c85" stroke="#ff5c85" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[18px] sm:h-[18px]">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-[#ff5c85] sm:w-[18px] sm:h-[18px]">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                )}
              </span>
              <span className="text-xs text-foreground/70">{heartCount}</span>
            </button>
            
            {/* Admin controls */}
            {isAdmin && (
              <AdminControls 
                post={post} 
                onEdit={handleEdit} 
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>
      </div>

      <PostModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        post={{
          id: post.id,
          title: post.title,
          content: post.contentHTML || '',
          createdAt: formattedDate,
          tags: post.tags
        }} 
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </>
  );
}
