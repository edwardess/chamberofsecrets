"use client";

import { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem } from "@heroui/react";
import { Space, Group, CreateSpaceData, UpdateSpaceData } from "@/lib/types";
import { createSpace, updateSpace, getSpacesByGroupId } from "@/lib/spaces";
import { getAllGroups } from "@/lib/groups";

interface SpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  space?: Space; // If provided, we're editing an existing space
  groupId?: string; // If provided, pre-select this group
  title?: string;
}

export default function SpaceModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  space,
  groupId,
  title = space ? "Edit Space" : "Create Space" 
}: SpaceModalProps) {
  const [name, setName] = useState(space?.name || "");
  const [selectedGroupId, setSelectedGroupId] = useState(space?.groupId || groupId || "");
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load groups when modal opens
  useEffect(() => {
    if (isOpen) {
      loadGroups();
    }
  }, [isOpen]);

  const loadGroups = async () => {
    setIsLoadingGroups(true);
    try {
      const groupsData = await getAllGroups();
      setGroups(groupsData);
      
      // If we don't have a pre-selected group, select the first one
      if (!selectedGroupId && groupsData.length > 0) {
        setSelectedGroupId(groupsData[0].id);
      }
    } catch (error) {
      console.error("Error loading groups:", error);
      setError("Failed to load groups. Please try again.");
    } finally {
      setIsLoadingGroups(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("Space name is required");
      return;
    }
    
    if (!selectedGroupId) {
      setError("Please select a group");
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    
    try {
      if (space) {
        // Update existing space
        const updateData: UpdateSpaceData = { 
          name,
          groupId: selectedGroupId,
          order: space.order // Preserve existing order if available
        };
        await updateSpace(space.id, updateData);
      } else {
        // Create new space
        // Get the current count of spaces in this group to set the order
        const existingSpaces = await getSpacesByGroupId(selectedGroupId);
        const newOrder = existingSpaces.length; // Use count as order (0-based index)
        
        const spaceData: CreateSpaceData = { 
          name, 
          groupId: selectedGroupId,
          order: newOrder
        };
        await createSpace(spaceData);
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving space:", error);
      setError("Failed to save space. Please try again.");
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
                <label htmlFor="space-name" className="block text-sm font-medium text-foreground/70 mb-1">
                  Space Name
                </label>
                <Input
                  id="space-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter space name"
                  autoFocus
                  isRequired
                />
              </div>
              
              <div>
                <label htmlFor="space-group" className="block text-sm font-medium text-foreground/70 mb-1">
                  Group
                </label>
                <Select
                  id="space-group"
                  placeholder={isLoadingGroups ? "Loading groups..." : "Select a group"}
                  selectedKeys={selectedGroupId ? [selectedGroupId] : []}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  isDisabled={isLoadingGroups}
                  isRequired
                >
                  {groups.map((group) => (
                    <SelectItem key={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </Select>
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
              disabled={isSubmitting || isLoadingGroups}
            >
              {space ? "Update" : "Create"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}



