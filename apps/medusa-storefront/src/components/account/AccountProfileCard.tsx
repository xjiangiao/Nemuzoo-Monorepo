import { formatDate } from "@/lib/utils";
import type { Customer } from "@/types";

type AccountProfileCardProps = {
  customer: Customer | null;
};

export default function AccountProfileCard({ customer }: AccountProfileCardProps) {
  return (
    <div className="rounded-xl border border-border-primary bg-surface-elevated p-6">
      <h2 className="mb-4 text-sm font-medium text-text-primary">Profile</h2>
      <div className="flex flex-col gap-3 text-sm">
        <div>
          <span className="text-text-muted">Name</span>
          <p className="text-text-primary">
            {[customer?.first_name, customer?.last_name]
              .filter(Boolean)
              .join(" ") || "-"}
          </p>
        </div>
        <div>
          <span className="text-text-muted">Email</span>
          <p className="text-text-primary">{customer?.email}</p>
        </div>
        {customer?.created_at && (
          <div>
            <span className="text-text-muted">Member since</span>
            <p className="text-text-primary">
              {formatDate(customer.created_at)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
