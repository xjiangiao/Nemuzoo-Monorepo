interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 text-center ${className}`}>
      {icon && (
        <div className="text-5xl text-text-muted mb-4">
          {icon}
        </div>
      )}
      <h3
        className="text-xl font-medium text-text-primary font-heading"
      >
        {title}
      </h3>
      {description && (
        <p className="mt-2 text-sm text-text-secondary max-w-sm">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
