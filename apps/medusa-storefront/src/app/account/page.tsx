"use client";

import { useState } from "react";

import AccountAddressSection from "@/components/account/AccountAddressSection";
import AccountOrdersCard from "@/components/account/AccountOrdersCard";
import AccountProfileCard from "@/components/account/AccountProfileCard";
import AuthModal from "@/components/auth/AuthModal";
import { useAuthStore } from "@/lib/auth/store";

type AccountSection = "profile" | "addresses" | "orders";

export default function AccountPage() {
  const { customer, isAuthenticated, isLoading } = useAuthStore();
  const [activeSection, setActiveSection] = useState<AccountSection | null>(
    "profile"
  );

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="mb-8 font-heading text-2xl font-bold text-text-primary">
          My Account
        </h1>
        <div className="rounded-xl border border-border-primary bg-surface-elevated p-6">
          <p className="text-sm text-text-muted">Checking your session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
        <h1 className="font-heading text-2xl font-bold text-text-primary">
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
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="mb-8 font-heading text-2xl font-bold text-text-primary">
        My Account
      </h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <AccountSectionButton
          title="Profile"
          description="Name, email, and membership details"
          isActive={activeSection === "profile"}
          onClick={() => setActiveSection("profile")}
        />
        <AccountSectionButton
          title="Addresses"
          description="Shipping and billing addresses"
          isActive={activeSection === "addresses"}
          onClick={() => setActiveSection("addresses")}
        />
        <AccountSectionButton
          title="Orders"
          description="Order history and status"
          isActive={activeSection === "orders"}
          onClick={() => setActiveSection("orders")}
        />
      </div>

      <div className="space-y-6">
        {!activeSection && (
          <div className="mt-6 rounded-xl border border-border-primary bg-surface-elevated p-6">
            <p className="text-sm text-text-secondary">
              Choose a section above to manage your account.
            </p>
          </div>
        )}

        {activeSection === "profile" && (
          <div className="mt-6">
            <AccountProfileCard customer={customer} />
          </div>
        )}

        {activeSection === "addresses" && (
          <div className="mt-6">
            <AccountAddressSection customer={customer} />
          </div>
        )}

        {activeSection === "orders" && (
          <div className="mt-6">
            <AccountOrdersCard />
          </div>
        )}
      </div>
    </div>
  );
}

function AccountSectionButton({
  title,
  description,
  isActive,
  onClick,
}: {
  title: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`rounded-xl border p-4 text-left transition-colors ${
        isActive
          ? "border-accent bg-accent/10"
          : "border-border-primary bg-surface-elevated hover:border-accent/60"
      }`}
    >
      <span className="block text-sm font-medium text-text-primary">
        {title}
      </span>
      <span className="mt-1 block text-xs leading-relaxed text-text-secondary">
        {description}
      </span>
    </button>
  );
}
