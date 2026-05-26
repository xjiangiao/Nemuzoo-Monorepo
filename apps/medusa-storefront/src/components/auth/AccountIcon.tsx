"use client";

import { UserIcon } from "lucide-react";
import { useAuthStore } from "@/lib/auth/store";
import AuthModal from "@/components/auth/AuthModal";
import AuthMenu from "@/components/auth/AuthMenu";

export default function AccountIcon() {
  const { isAuthenticated, isLoading, hydrated } = useAuthStore();

  if (!hydrated && isLoading) {
    return (
      <div className="p-2 text-text-muted" aria-hidden="true">
        <UserIcon className="size-4 opacity-40" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <AuthMenu />;
  }

  return <AuthModal />;
}
