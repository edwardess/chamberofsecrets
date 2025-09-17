"use client";

import { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, RadioGroup, Radio } from "@heroui/react";
import { Space } from "@/lib/types";
import { deleteSpace, getAllSpaces } from "@/lib/spaces";
import { reassignPosts, deletePostsBySpace } from "@/lib/post-management";
import { getPostsBySpace } from "@/lib/posts";

interface DeleteSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  space: Space;
}

type DeletionStrategy = "delete_posts" | "reassign_posts";

export default function DeleteSpaceModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  space
}: DeleteSpaceModalProps) {
  const [strategy, setStrategy] = useState<DeletionStrategy>("delete_posts");
  const [targetSpaceId, setTargetSpaceId] = useState<string>("");
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [hasPosts, setHasPosts] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if space has posts and load other spaces when modal opens
  useEffect(() => {
    if (isOpen) {
      checkForPosts();
      loadSpaces();
    }
  }, [isOpen, space]);

  const checkForPosts = async () => {
    try {
      const posts = await getPostsBySpace(space.id);
      setHasPosts(posts.length > 0);
    } catch (error) {
      console.error("Error checking for posts:", error);
    }
  };

  const loadSpaces = async () => {
    setIsLoading(true);
    try {
      const allSpaces = await getAllSpaces();
      // Filter out the current space
      setSpaces(allSpaces.filter(s => s.id !== space.id));
    } catch (error) {
      console.error("Error loading spaces:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (hasPosts && strategy === "reassign_posts" && !targetSpaceId) {
      setError("Please select a target space");
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    
    try {
      if (hasPosts) {
        if (strategy === "delete_posts") {
          // Delete all posts in the space
          await deletePostsBySpace(space.id);
        } else {
          // Reassign posts to another space
          await reassignPosts(space.id, targetSpaceId);
        }
      }
      
      // Delete the space itself
      await deleteSpace(space.id);
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error deleting space:", error);
      setError("Failed to delete space. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Delete Space</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <p className="text-foreground/70">
                Are you sure you want to delete the space <strong>{space.name}</strong>?
              </p>
              
              {hasPosts && (
                <div className="bg-warning/10 p-3 rounded-lg border border-warning/30">
                  <p className="text-warning-600 font-medium mb-2">Warning</p>
                  <p className="text-sm text-foreground/70 mb-4">
                    This space contains posts. What would you like to do with them?
                  </p>
                  
                  <RadioGroup value={strategy} onChange={(value: any) => setStrategy(value)}>
                    <Radio value="delete_posts">
                      Delete all posts in this space
                    </Radio>
                    <Radio 
                      value="reassign_posts"
                      isDisabled={spaces.length === 0 || isLoading}
                    >
                      Move posts to another space
                    </Radio>
                  </RadioGroup>
                  
                  {strategy === "reassign_posts" && !isLoading && spaces.length > 0 && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-foreground/70 mb-2">
                        Select target space
                      </label>
                      <select
                        className="w-full p-2 border rounded-lg"
                        value={targetSpaceId}
                        onChange={(e) => setTargetSpaceId(e.target.value)}
                        required
                      >
                        <option value="">Select a space</option>
                        {spaces.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}
              
              {error && (
                <div className="text-danger text-sm">{error}</div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button 
              color="default" 
              variant="flat" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              color="danger" 
              type="submit"
              isLoading={isSubmitting}
              disabled={isSubmitting || isLoading}
            >
              Delete
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}











