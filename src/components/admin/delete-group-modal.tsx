"use client";

import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, RadioGroup, Radio } from "@heroui/react";
import { Group } from "@/lib/types";
import { deleteGroup } from "@/lib/groups";
import { deleteSpacesAndPostsByGroup, reassignSpacesToGroup } from "@/lib/post-management";

interface DeleteGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  group: Group;
  groups: Group[];
  hasSpaces: boolean;
}

type DeletionStrategy = "delete_all" | "reassign";

export default function DeleteGroupModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  group,
  groups,
  hasSpaces
}: DeleteGroupModalProps) {
  const [strategy, setStrategy] = useState<DeletionStrategy>("delete_all");
  const [targetGroupId, setTargetGroupId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableGroups = groups.filter(g => g.id !== group.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (hasSpaces && strategy === "reassign" && !targetGroupId) {
      setError("Please select a target group");
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    
    try {
      if (hasSpaces) {
        if (strategy === "delete_all") {
          // Delete all spaces and posts in the group
          await deleteSpacesAndPostsByGroup(group.id);
        } else {
          // Reassign spaces to another group
          await reassignSpacesToGroup(group.id, targetGroupId);
        }
      }
      
      // Delete the group itself
      await deleteGroup(group.id);
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error deleting group:", error);
      setError("Failed to delete group. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Delete Group</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <p className="text-foreground/70">
                Are you sure you want to delete the group <strong>{group.name}</strong>?
              </p>
              
              {hasSpaces && (
                <div className="bg-warning/10 p-3 rounded-lg border border-warning/30">
                  <p className="text-warning-600 font-medium mb-2">Warning</p>
                  <p className="text-sm text-foreground/70 mb-4">
                    This group contains spaces. What would you like to do with them?
                  </p>
                  
                  <RadioGroup value={strategy} onChange={(value: any) => setStrategy(value)}>
                    <Radio value="delete_all">
                      Delete all spaces and their posts
                    </Radio>
                    <Radio 
                      value="reassign"
                      isDisabled={availableGroups.length === 0}
                    >
                      Move spaces to another group
                    </Radio>
                  </RadioGroup>
                  
                  {strategy === "reassign" && availableGroups.length > 0 && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-foreground/70 mb-2">
                        Select target group
                      </label>
                      <select
                        className="w-full p-2 border rounded-lg"
                        value={targetGroupId}
                        onChange={(e) => setTargetGroupId(e.target.value)}
                        required
                      >
                        <option value="">Select a group</option>
                        {availableGroups.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.name}
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
              disabled={isSubmitting}
            >
              Delete
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}











