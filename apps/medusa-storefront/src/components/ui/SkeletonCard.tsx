export default function SkeletonCard({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`soft-shadow overflow-hidden rounded-[2rem] bg-surface-elevated p-4 ${className}`}
    >
      <div className="aspect-square animate-pulse rounded-2xl bg-surface-secondary" />
      <div className="mt-3 space-y-2 px-1">
        <div className="h-4 w-3/4 animate-pulse rounded-full bg-surface-secondary" />
        <div className="h-3 w-1/2 animate-pulse rounded-full bg-surface-secondary" />
      </div>
    </div>
  );
}
