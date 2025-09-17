"use client";

import { useState } from "react";
import { Post } from "@/lib/types";
import PostModal from "@/components/post-modal";
import PostCard from "@/components/ui/post-card";

interface PostListProps {
  posts: Post[];
  isLoading: boolean;
  onEditPost?: (post: Post) => void;
  onDeletePost?: (post: Post) => void;
}

export default function PostList({ posts, isLoading, onEditPost, onDeletePost }: PostListProps) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle post selection and modal opening
  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  // Handle modal state change
  const handleModalStateChange = (isOpen: boolean) => {
    setIsModalOpen(isOpen);
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  // Render skeleton loaders while loading
  if (isLoading) {
    return (
      <div role="list" aria-busy="true" aria-label="Loading posts">
        {Array(3).fill(0).map((_, index) => (
          <div 
            key={index}
            role="listitem"
            className="animate-pulse border border-foreground/10 rounded-lg px-5 py-4 mb-3"
          >
            <div className="flex justify-between">
              <div className="flex-1">
                <div className="h-6 bg-foreground/10 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-foreground/10 rounded w-1/4"></div>
              </div>
              <div className="w-5 h-5 bg-foreground/10 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // No posts message
  if (posts.length === 0) {
    return (
      <div 
        className="text-center py-12 bg-foreground/5 rounded-lg"
        aria-live="polite"
      >
        <p className="text-foreground/70">No posts found in this category.</p>
      </div>
    );
  }

  // Render posts list
  return (
    <>
      <div 
        className="border border-foreground/40 rounded-lg overflow-hidden shadow-sm divide-y divide-foreground/40"
        role="list"
        aria-label="Posts list"
      >
        {posts.map((post) => (
          <div 
            key={post.id}
            role="listitem"
          >
            <PostCard 
              post={post} 
              onEdit={onEditPost ? () => onEditPost(post) : undefined}
              onDelete={onDeletePost ? () => onDeletePost(post) : undefined}
            />
          </div>
        ))}
      </div>

      {/* Post Modal */}
      {selectedPost && (
        <PostModal
          open={isModalOpen}
          onOpenChange={handleModalStateChange}
          post={{
            title: selectedPost.title,
            content: selectedPost.contentHTML,
            createdAt: formatDate(selectedPost.createdAt),
            tags: selectedPost.tags
          }}
        />
      )}
    </>
  );
}
