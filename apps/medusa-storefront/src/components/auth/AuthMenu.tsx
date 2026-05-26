"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth/store";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { UserIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * Renders an account dropdown menu that displays the current customer (first and last name or email)
 * and provides actions to navigate to the account page or sign out.
 *
 * Selecting "Sign Out" triggers the configured logout action and refreshes router data.
 *
 * @returns A React element representing the account dropdown menu.
 */
export default function AuthMenu() {
  const { customer, logout } = useAuthStore();
  const router = useRouter();

  const handleSignOut = async () => {
    await logout();
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label="Account menu" />
        }
      >
        <UserIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>
          {customer?.first_name
            ? `${customer.first_name} ${customer.last_name}`
            : customer?.email}
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer"
            render={<Link href="/account" />}
          >
            My Account
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            onClick={handleSignOut}
          >
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
