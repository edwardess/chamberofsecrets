"use client";

import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@heroui/react";
import { Group, CreateGroupData, UpdateGroupData } from "@/lib/types";
import { createGroup, updateGroup, getAllGroups } from "@/lib/groups";

interface GroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  group?: Group; // If provided, we're editing an existing group
  title?: string;
}

export default function GroupModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  group,
  title = group ? "Edit Group" : "Create Group" 
}: GroupModalProps) {
  const [name, setName] = useState(group?.name || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("Group name is required");
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    
    try {
      if (group) {
        // Update existing group
        const updateData: UpdateGroupData = { 
          name,
          order: group.order // Preserve existing order if available
        };
        await updateGroup(group.id, updateData);
      } else {
        // Create new group
        // Get the count of existing groups to set the order
        const allGroups = await getAllGroups();
        const newOrder = allGroups.length; // Use count as order (0-based index)
        
        const groupData: CreateGroupData = { 
          name,
          order: newOrder 
        };
        await createGroup(groupData);
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving group:", error);
      setError("Failed to save group. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>{title}</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div>
                <label htmlFor="group-name" className="block text-sm font-medium text-foreground/70 mb-1">
                  Group Name
                </label>
                <Input
                  id="group-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter group name"
                  autoFocus
                  isRequired
                />
              </div>
              
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
              color="primary" 
              type="submit"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {group ? "Update" : "Create"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}



