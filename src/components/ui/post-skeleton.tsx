export default function PostSkeleton() {
  return (
    <div className="animate-pulse border border-foreground/10 rounded-lg p-4 mb-4">
      <div className="h-7 bg-foreground/10 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-foreground/10 rounded w-1/4 mb-6"></div>
      <div className="space-y-2">
        <div className="h-4 bg-foreground/10 rounded w-full"></div>
        <div className="h-4 bg-foreground/10 rounded w-5/6"></div>
        <div className="h-4 bg-foreground/10 rounded w-4/6"></div>
      </div>
    </div>
  );
}













