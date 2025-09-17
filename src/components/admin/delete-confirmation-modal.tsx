"use client";

import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  description: string;
  itemName: string;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName
}: DeleteConfirmationModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setIsDeleting(true);
    setError(null);
    
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Error during deletion:", error);
      setError("Failed to delete. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="text-danger">{title}</ModalHeader>
        <ModalBody>
          <p className="mb-4">{description}</p>
          <p className="font-medium">"{itemName}"</p>
          
          {error && (
            <div className="mt-4 text-danger text-sm">{error}</div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button 
            color="default" 
            variant="flat" 
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            color="danger" 
            onClick={handleConfirm}
            isLoading={isDeleting}
            disabled={isDeleting}
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}







