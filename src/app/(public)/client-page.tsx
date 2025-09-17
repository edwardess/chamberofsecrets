"use client";

import { useState, useEffect } from "react";
import { getPostsBySpace, getTagsBySpace, deletePost } from "@/lib/posts";
import { getSpaceGroups, getAllSpaces } from "@/lib/spaces";
import { Post, Space, SpaceGroup } from "@/lib/types";
import SpaceSidebar from "@/components/ui/space-sidebar";
import AdminSpaceSidebar from "@/components/ui/admin-space-sidebar";
import PostList from "@/components/ui/post-list";
import TagFilter from "@/components/ui/tag-filter";
import AdminControls from "@/components/admin/admin-controls";
import Header from "@/components/ui/header";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import PostEditorModal from "@/components/post-editor-modal";
import DeleteConfirmationModal from "@/components/admin/delete-confirmation-modal";
import { toast, ToastContainer } from "@/components/ui/toast-notification";

export default function ClientPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [spaceGroups, setSpaceGroups] = useState<SpaceGroup[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [activeSpaceId, setActiveSpaceId] = useState<string>("");
  const [activeSpace, setActiveSpace] = useState<Space | null>(null);
  const [activeTag, setActiveTag] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [isContentLoading, setIsContentLoading] = useState(true);
  const [tags, setTags] = useState<{name: string, count: number}[]>([]);
  const [isPostEditorOpen, setIsPostEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | undefined>(undefined);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  
  const { isAdmin } = useAuth();
  const router = useRouter();

  // Fetch initial data (spaces and groups)
  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      
      // Get all spaces and organize by group
      const spaceGroupsData = await getSpaceGroups();
      setSpaceGroups(spaceGroupsData);
      
      // Get all spaces (flat list)
      const spacesData = await getAllSpaces();
      setSpaces(spacesData);
      
      // If no active space is set, use the first space
      if (!activeSpaceId && spacesData.length > 0) {
        setActiveSpaceId(spacesData[0].id);
        setActiveSpace(spacesData[0]);
      }

      setIsLoading(false);
      
      // Fetch content for the active space
      await fetchSpaceContent(activeSpaceId || (spacesData.length > 0 ? spacesData[0].id : ""));
      
    } catch (error) {
      console.error("Error fetching initial data:", error);
      setIsLoading(false);
    }
  };
  
  // Fetch content (posts and tags) for a specific space
  const fetchSpaceContent = async (spaceId: string) => {
    if (!spaceId) return;
    
    try {
      setIsContentLoading(true);
      
      // Get posts for the space
      const spacePosts = await getPostsBySpace(spaceId);
      setPosts(spacePosts);
      setFilteredPosts(spacePosts);
      
      // Get tags for the space
      const spaceTags = await getTagsBySpace(spaceId);
      setTags(spaceTags.map(tag => ({ 
        name: tag, 
        count: spacePosts.filter(post => post.tags.includes(tag)).length 
      })));
      
    } catch (error) {
      console.error("Error fetching space content:", error);
    } finally {
      setIsContentLoading(false);
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    fetchInitialData();
  }, []);
  
  // Fetch content when active space changes
  useEffect(() => {
    if (activeSpaceId) {
      fetchSpaceContent(activeSpaceId);
    }
  }, [activeSpaceId]);

  // Handle space selection
  const handleSpaceSelect = async (spaceId: string) => {
    if (spaceId === activeSpaceId) return;
    
    setActiveSpaceId(spaceId);
    setActiveTag("All"); // Reset tag filter when changing space
    
    // Find the space object
    const space = spaces.find(s => s.id === spaceId);
    if (space) {
      setActiveSpace(space);
    }
  };
  
  // Filter posts by active tag
  useEffect(() => {
    if (activeTag === "All") {
      setFilteredPosts(posts);
    } else {
      const postsWithTag = posts.filter(post => 
        post.tags && post.tags.includes(activeTag)
      );
      setFilteredPosts(postsWithTag);
    }
  }, [posts, activeTag]);
  
  // Handle tag selection
  const handleTagSelect = (tag: string) => {
    setActiveTag(tag);
  };
  
  // Handle new post button click
  const handleNewPost = () => {
    setEditingPost(undefined); // Clear any editing post
    setIsPostEditorOpen(true); // Open the modal for new post
  };
  
  // Handle post edit
  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setIsPostEditorOpen(true);
  };
  
  // Handle post delete
  const handleDeletePost = (post: Post) => {
    setPostToDelete(post);
    setIsDeleteModalOpen(true);
  };
  
  // Handle post delete confirmation
  const handleConfirmDelete = async () => {
    if (!postToDelete) return;
    
    await deletePost(postToDelete.id);
    toast.success("Post deleted successfully");
    
    // Optimistically remove from UI
    const updatedPosts = posts.filter(p => p.id !== postToDelete.id);
    setPosts(updatedPosts);
    setFilteredPosts(filteredPosts.filter(p => p.id !== postToDelete.id));
    
    // Refresh data to update tags counts, etc.
    fetchSpaceContent(activeSpaceId);
  };
  
  // Handle post editor success (create/update)
  const handlePostEditorSuccess = () => {
    toast.success(editingPost ? "Post updated successfully" : "Post created successfully");
    
    // Add small delay before refreshing to allow Firestore to complete update
    setTimeout(() => {
      fetchSpaceContent(activeSpaceId); // Refresh the posts list
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ToastContainer />
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-8 flex-grow">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - show admin version if user is admin */}
          {isAdmin ? (
            <AdminSpaceSidebar
              spaceGroups={spaceGroups}
              activeSpaceId={activeSpaceId}
              isLoading={isLoading}
              onSelectSpace={handleSpaceSelect}
              onRefresh={() => {
                // Refresh data when admin makes changes
                setIsLoading(true);
                fetchInitialData();
              }}
              groupLabel="Categories"
              spacesLabel="Spaces"
            />
          ) : (
            <SpaceSidebar
              spaceGroups={spaceGroups}
              activeSpaceId={activeSpaceId}
              isLoading={isLoading}
              onSelectSpace={handleSpaceSelect}
              groupLabel="Categories"
              spacesLabel="Spaces"
            />
          )}
          
          {/* Main content */}
          <div className="flex-1">
            <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                  {activeSpace ? activeSpace.name : "Loading..."}
                </h1>
                <p className="text-sm sm:text-base text-foreground/70 mt-1.5">
                  {activeSpace 
                    ? `Questions related to ${activeSpace.name}`
                    : "Browse through frequently asked questions"}
                </p>
              </div>
              
              {/* Admin controls for new post */}
              {isAdmin && activeSpaceId && (
                <div className="flex-shrink-0">
                  <AdminControls
                    spaceId={activeSpaceId}
                    onNew={handleNewPost}
                  />
                </div>
              )}
            </div>
            
            {/* Tag filter */}
            <TagFilter 
              tags={tags} 
              activeTag={activeTag} 
              onSelectTag={handleTagSelect}
              isLoading={isContentLoading}
            />
            
            {/* Posts list */}
            <div>
              <PostList 
                posts={filteredPosts} 
                isLoading={isContentLoading}
                onEditPost={handleEditPost}
                onDeletePost={handleDeletePost}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Post Editor Modal */}
      <PostEditorModal
        isOpen={isPostEditorOpen}
        onClose={() => setIsPostEditorOpen(false)}
        onSuccess={handlePostEditorSuccess}
        post={editingPost}
        spaceId={activeSpaceId}
      />
      
      {/* Delete Confirmation Modal */}
      {postToDelete && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Post"
          description="Are you sure you want to delete this post? This action cannot be undone."
          itemName={postToDelete.title}
        />
      )}
    </div>
  );
}