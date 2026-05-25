export default function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-xl overflow-hidden ${className}`}>
      <div className="aspect-square bg-[var(--color-surface-secondary)] animate-pulse rounded-xl" />
      <div className="mt-3 space-y-2 px-1">
        <div className="h-4 bg-[var(--color-surface-secondary)] animate-pulse rounded w-3/4" />
        <div className="h-3 bg-[var(--color-surface-secondary)] animate-pulse rounded w-1/2" />
      </div>
    </div>
  );
}
