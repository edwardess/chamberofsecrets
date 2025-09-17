"use client";

import React from "react";

interface TagWithCount {
  name: string;
  count: number;
}

interface TagFilterProps {
  tags: TagWithCount[];
  activeTag: string;
  onSelectTag: (tag: string) => void;
  isLoading?: boolean;
}

export default function TagFilter({ 
  tags, 
  activeTag, 
  onSelectTag,
  isLoading = false 
}: TagFilterProps) {
  // Add "All" tag at the beginning with total count
  const totalCount = tags.reduce((sum, tag) => sum + tag.count, 0);
  const allTags = [
    { name: "All", count: totalCount },
    ...tags.filter(tag => tag.name !== "All")
  ];

  // Render skeleton loaders while loading
  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2 mb-6" aria-busy="true" aria-label="Loading tags">
        {Array(4).fill(0).map((_, index) => (
          <div 
            key={index}
            className="animate-pulse h-8 w-16 bg-foreground/10 rounded-full"
          />
        ))}
      </div>
    );
  }

  // No tags message
  if (allTags.length <= 1) {
    return null; // Only "All" tag, no need to show filter
  }

  return (
    <div className="mb-4" role="group" aria-label="Filter posts by tag">
      {/* Desktop: flex-wrap, Mobile: horizontal scroll */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 sm:flex-wrap sm:overflow-visible sm:pb-0">
        {allTags.map((tag) => (
          <button
            key={tag.name}
            onClick={() => onSelectTag(tag.name)}
            className={`
              flex-shrink-0 px-3 py-1.5 sm:py-1 rounded-full text-xs font-medium transition-all
              focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-1
              ${activeTag === tag.name 
                ? "bg-stone-500 text-white" 
                : "bg-foreground/5 text-foreground/80 hover:bg-foreground/15 hover:text-foreground cursor-pointer hover:shadow-sm"}
            `}
            aria-pressed={activeTag === tag.name}
            aria-label={`Filter by ${tag.name} tag (${tag.count} posts)`}
          >
            <span className="whitespace-nowrap">{tag.name}</span>
            {tag.count > 0 && (
              <span className={`ml-1.5 text-[10px] ${activeTag === tag.name ? 'bg-stone-700' : 'bg-foreground/10'} rounded-full px-1.5 py-0.5`}>
                {tag.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
