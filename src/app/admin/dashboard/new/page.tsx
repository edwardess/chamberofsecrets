"use client";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function NewPostPage() {
  const router = useRouter();
  
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Create New Post
        </h1>
        <Button 
          color="default" 
          variant="flat"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
      
      <div className="p-6 bg-foreground/5 rounded-lg border border-foreground/10">
        <p className="text-foreground/70">
          This is a placeholder for the new post creation page. 
          Post creation functionality will be implemented in Phase 7-9.
        </p>
      </div>
    </div>
  );
}














