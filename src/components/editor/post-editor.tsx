"use client";

import { useState } from "react";

interface PostEditorProps {
  initialContent?: string;
  onSave?: (content: string) => void;
}

export default function PostEditor({ initialContent = "", onSave }: PostEditorProps) {
  const [content, setContent] = useState(initialContent);

  const handleSave = () => {
    onSave?.(content);
  };

  return (
    <div className="space-y-4">
      <div className="border border-foreground/20 rounded-lg p-4 min-h-[400px]">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your post content here..."
          className="w-full h-full min-h-[350px] resize-none border-none outline-none bg-transparent text-foreground placeholder:text-foreground/50"
        />
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-foreground/60">
          This is a placeholder for the rich text editor. Tiptap integration will be implemented in Phase 8.
        </div>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Post
        </button>
      </div>
    </div>
  );
}
