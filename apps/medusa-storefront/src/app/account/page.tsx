"use client";

import { useAuthStore } from "@/lib/auth/store";
import AuthModal from "@/components/auth/AuthModal";
import { formatDate } from "@/lib/utils";

export default function AccountPage() {
  const { customer, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <p className="text-sm text-text-muted">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 gap-4">
        <h1 className="text-2xl font-heading font-bold text-text-primary">
          My Account
        </h1>
        <p className="text-sm text-text-secondary">
          Sign in to view your account details and order history.
        </p>
        <AuthModal />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-heading font-bold text-text-primary mb-8">
        My Account
      </h1>

      <div className="rounded-xl border border-border-primary bg-surface-elevated p-6">
        <h2 className="text-sm font-medium text-text-primary mb-4">
          Profile
        </h2>
        <div className="flex flex-col gap-3 text-sm">
          <div>
            <span className="text-text-muted">Name</span>
            <p className="text-text-primary">
              {customer?.first_name
                ? `${customer.first_name} ${customer.last_name}`
                : "—"}
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

      <div className="mt-6 rounded-xl border border-border-primary bg-surface-elevated p-6">
        <h2 className="text-sm font-medium text-text-primary mb-4">
          Orders
        </h2>
        <p className="text-sm text-text-muted">
          No orders yet. Start exploring our collection!
        </p>
      </div>
    </div>
  );
}
