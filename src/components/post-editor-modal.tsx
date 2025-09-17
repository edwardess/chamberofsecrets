"use client";

import { useState, useEffect } from "react";
import { Button, Input, Select, SelectItem, Chip } from "@heroui/react";
import { Post, CreatePostData, Space } from "@/lib/types";
import { createPost, updatePost } from "@/lib/posts";
import { getAllSpaces } from "@/lib/spaces";
import JoditEditor from "@/components/editor/jodit-editor";
import CustomModal from "@/components/ui/custom-modal";
import { useAuth } from "@/contexts/auth-context";

// Plus icon component
function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}

// Save icon component
function SaveIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
      <polyline points="17 21 17 13 7 13 7 21"></polyline>
      <polyline points="7 3 7 8 15 8"></polyline>
    </svg>
  );
}

interface PostEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  post?: Post; // If provided, we're editing an existing post
  spaceId?: string; // If provided, pre-select this space
  title?: string;
}

export default function PostEditorModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  post,
  spaceId
}: PostEditorModalProps) {
  const { isAdmin } = useAuth();
  const [postTitle, setPostTitle] = useState(post?.title || "");
  // When editing a post, use the post's spaceId. Otherwise use the spaceId prop or empty string.
  const [selectedSpaceId, setSelectedSpaceId] = useState(post ? post.spaceId : (spaceId || ""));
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isLoadingSpaces, setIsLoadingSpaces] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Tag management
  const [tags, setTags] = useState<string[]>(post?.tags || []);
  const [tagInput, setTagInput] = useState("");
  
  // Content management
  const [contentHTML, setContentHTML] = useState(post?.contentHTML || "");
  
  // Hearts count (for admin editing)
  const [hearts, setHearts] = useState(post?.hearts || 0);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setPostTitle(post?.title || "");
      // When editing a post, use the post's spaceId. Otherwise use the spaceId prop or empty string.
      setSelectedSpaceId(post ? post.spaceId : (spaceId || ""));
      setTags(post?.tags || []);
      setContentHTML(post?.contentHTML || "");
      setHearts(post?.hearts || 0);
      setError(null);
      loadSpaces();
    }
  }, [isOpen, post, spaceId]);

  const loadSpaces = async () => {
    setIsLoadingSpaces(true);
    try {
      const spacesData = await getAllSpaces();
      setSpaces(spacesData);
      
      // If we don't have a pre-selected space, select the first one
      if (!selectedSpaceId && spacesData.length > 0) {
        setSelectedSpaceId(spacesData[0].id);
      }
    } catch (error) {
      console.error("Error loading spaces:", error);
      setError("Failed to load spaces. Please try again.");
    } finally {
      setIsLoadingSpaces(false);
    }
  };

  // Handle tag input
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput.trim().toLowerCase());
    }
  };

  const addTag = (tag: string) => {
    if (!tag) return;
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Handle content change from Jodit editor
  const handleContentChange = (html: string) => {
    setContentHTML(html);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!postTitle.trim()) {
      setError("Post title is required");
      return;
    }
    
    if (!selectedSpaceId) {
      setError("Please select a space");
      return;
    }
    
    if (!contentHTML.trim()) {
      setError("Post content is required");
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    
    try {
      if (post) {
        // Update existing post
        await updatePost(post.id, {
          title: postTitle,
          spaceId: selectedSpaceId,
          tags,
          contentHTML,
          hearts: hearts // Include hearts count in updates
        });
      } else {
        // Create new post
        const postData: CreatePostData = {
          title: postTitle,
          spaceId: selectedSpaceId,
          tags,
          contentHTML,
          hearts: hearts // Include hearts count in new posts
        };
        await createPost(postData);
      }
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error saving post:", error);
      if (error.message && error.message.includes("exceeds Firestore's limit")) {
        setError("Content size is too large. Please reduce the size of embedded videos or images.");
      } else {
        setError("Failed to save post. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalTitle = post ? "Edit Post" : "New Post";
  const modalDescription = post 
    ? "Edit the details of your post below." 
    : "Create a new post by filling out the form below.";

  return (
    <CustomModal 
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      description={modalDescription}
    >
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 flex-shrink-0">
          {/* Post Title */}
          <div>
            <label htmlFor="post-title" className="block text-sm font-medium text-foreground/80 mb-2">
              Post Title
            </label>
            <Input
              id="post-title"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              placeholder="Enter post title"
              autoFocus
              isRequired
              variant="bordered"
              size="lg"
              className={`text-lg ${!postTitle.trim() && error ? 'border-danger' : ''}`}
              aria-invalid={!postTitle.trim() && error ? "true" : "false"}
            />
            {!postTitle.trim() && error && (
              <p className="text-danger text-sm mt-1">Title is required</p>
            )}
          </div>
          
          {/* Space Selector */}
          <div>
            <label htmlFor="post-space" className="block text-sm font-medium text-foreground/80 mb-2">
              Space
            </label>
            <Select
              id="post-space"
              placeholder={isLoadingSpaces ? "Loading spaces..." : "Select a space"}
              selectedKeys={selectedSpaceId ? [selectedSpaceId] : []}
              onChange={(e) => setSelectedSpaceId(e.target.value)}
              isDisabled={isLoadingSpaces}
              isRequired
              variant="bordered"
              size="lg"
              className={`${!selectedSpaceId && error ? 'border-danger' : ''}`}
              aria-invalid={!selectedSpaceId && error ? "true" : "false"}
              popoverProps={{
                classNames: {
                  content: "bg-background border border-foreground/10 shadow-lg"
                }
              }}
            >
              {spaces.map((space) => (
                <SelectItem key={space.id}>
                  {space.name}
                </SelectItem>
              ))}
            </Select>
            {!selectedSpaceId && error && (
              <p className="text-danger text-sm mt-1">Space is required</p>
            )}
          </div>
          
          {/* Tags Input */}
          <div>
            <label htmlFor="post-tags" className="block text-sm font-medium text-foreground/80 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag) => (
                <Chip 
                  key={tag} 
                  onClose={() => removeTag(tag)}
                  color="primary"
                  variant="flat"
                  size="md"
                  className="transition-all hover:opacity-90 active:scale-95"
                  classNames={{
                    closeButton: "hover:bg-primary/20 transition-colors"
                  }}
                >
                  {tag}
                </Chip>
              ))}
              {tags.length === 0 && (
                <span className="text-foreground/50 text-sm italic">No tags added yet</span>
              )}
            </div>
            <Input
              id="post-tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder="Type a tag and press Enter to add"
              variant="bordered"
              size="md"
              endContent={
                tagInput.trim() && (
                  <Button 
                    size="sm" 
                    variant="flat" 
                    color="primary" 
                    isIconOnly 
                    onClick={() => addTag(tagInput.trim().toLowerCase())}
                    className="mr-1"
                  >
                    <PlusIcon />
                  </Button>
                )
              }
            />
            <p className="text-foreground/50 text-xs mt-1">Press Enter after each tag or click the + button</p>
          </div>
          
          {/* Hearts Count (Admin only) */}
          {isAdmin && (
            <div>
              <label htmlFor="post-hearts" className="block text-sm font-medium text-foreground/80 mb-2">
                Hearts Count
              </label>
              <Input
                id="post-hearts"
                type="number"
                min="0"
                value={hearts.toString()}
                onChange={(e) => setHearts(parseInt(e.target.value) || 0)}
                variant="bordered"
                size="lg"
                className="text-lg"
              />
            </div>
          )}

          {/* General error message */}
          {error && !(!postTitle.trim() || !selectedSpaceId || !contentHTML.trim()) && (
            <div className="text-danger text-sm">{error}</div>
          )}
        </div>
        
        {/* Rich Text Editor - Full height on mobile */}
        <div className="flex-1 flex flex-col min-h-0 px-4 sm:px-6 pb-4 sm:pb-6">
          <label htmlFor="post-content" className="block text-sm font-medium text-foreground/80 mb-2">
            Content
          </label>
          <div className={`flex-1 min-h-0 ${!contentHTML.trim() && error ? 'ring-1 ring-danger rounded-lg' : ''}`}>
            <JoditEditor 
              content={contentHTML} 
              onChange={handleContentChange} 
            />
          </div>
          {!contentHTML.trim() && error && (
            <p className="text-danger text-sm mt-1">Content is required</p>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-foreground/10 py-3 sm:py-4 px-4 sm:px-6 bg-background shadow-sm z-10 flex-shrink-0">
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
            <Button 
              color="default" 
              variant="light" 
              onClick={onClose}
              disabled={isSubmitting}
              size="lg"
              className="w-full sm:w-auto px-4 sm:px-6"
            >
              Cancel
            </Button>
            <Button 
              color="primary" 
              type="submit"
              isLoading={isSubmitting}
              disabled={isSubmitting || isLoadingSpaces || (!postTitle.trim() && !contentHTML.trim())}
              size="lg"
              className="w-full sm:w-auto px-6 sm:px-8 font-medium"
              startContent={!isSubmitting && <SaveIcon />}
            >
              {post ? "Save Changes" : "Create Post"}
            </Button>
          </div>
        </div>
      </form>
    </CustomModal>
  );
}