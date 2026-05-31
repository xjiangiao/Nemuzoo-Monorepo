"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import CartIcon from "@/components/cart/CartIcon";
import AccountIcon from "@/components/auth/AccountIcon";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/products", label: "Shop", activePrefix: "/products" },
  { href: "/about", label: "Story", activePrefix: "/about" },
  { href: "/faq", label: "Care", activePrefix: "/faq" },
];

/**
 * Renders a responsive, sticky top navigation header with a brand link, desktop navigation links, account and cart icons, and a mobile menu.
 *
 * @returns The header element containing navigation links, account and cart icons, and a mobile menu.
 */
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!menuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        headerRef.current?.contains(event.target)
      ) {
        return;
      }

      setMenuOpen(false);
    };

    const handleScroll = () => setMenuOpen(false);

    window.addEventListener("pointerdown", handlePointerDown, true);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown, true);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [menuOpen]);

  const isActive = (activePrefix: string) =>
    pathname === activePrefix || pathname.startsWith(`${activePrefix}/`);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-border-primary bg-surface-primary/85 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="flex items-center" aria-label="Nemuzoo home">
          <Image
            src="/nemuzoo-wordmark.svg"
            alt="nemuzoo"
            width={188}
            height={28}
            priority
            className="h-6 w-auto max-w-[132px] sm:h-7 sm:max-w-none"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.activePrefix) ? "page" : undefined}
              className={cn(
                "text-sm font-medium transition-colors hover:text-text-primary",
                isActive(item.activePrefix)
                  ? "text-text-primary"
                  : "text-text-secondary",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <AccountIcon />
          <CartIcon />
          <button
            type="button"
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center text-text-secondary transition-colors hover:text-text-primary md:hidden"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-site-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Menu
              size={22}
              className={`transition-transform duration-200 ease-out ${
                menuOpen ? "rotate-90" : "rotate-0"
              }`}
            />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="absolute left-0 right-0 top-full z-10 md:hidden">
          <nav
            id="mobile-site-nav"
            className="mobile-menu-panel mx-4 mt-3 space-y-1 rounded-[2rem] border border-border-primary bg-surface-primary/95 p-3 shadow-xl backdrop-blur-xl"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                aria-current={isActive(item.activePrefix) ? "page" : undefined}
                className={cn(
                  "block rounded-2xl px-4 py-3 text-sm font-semibold transition-colors hover:bg-surface-secondary hover:text-text-primary",
                  isActive(item.activePrefix)
                    ? "bg-surface-secondary text-text-primary"
                    : "text-text-secondary",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
