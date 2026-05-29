"use client";

import { UserIcon } from "lucide-react";
import { useAuthStore } from "@/lib/auth/store";
import AuthModal from "@/components/auth/AuthModal";
import AuthMenu from "@/components/auth/AuthMenu";

/**
 * Render account-related UI based on authentication and hydration state.
 *
 * @returns A React element: a muted placeholder while authentication state is hydrating/loading, the authenticated account menu when the user is signed in, or the authentication modal when the user is not signed in.
 */
export default function AccountIcon() {
  const { isAuthenticated, isLoading, hydrated } = useAuthStore();

  if (!hydrated && isLoading) {
    return (
      <div className="flex h-10 w-10 items-center justify-center text-text-muted" aria-hidden="true">
        <UserIcon className="size-5 opacity-40" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <AuthMenu />;
  }

  return <AuthModal />;
}
