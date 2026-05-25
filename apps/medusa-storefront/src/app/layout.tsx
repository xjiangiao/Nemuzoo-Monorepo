import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nemuzoo - Your Store",
  description: "Shop the best products at Nemuzoo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white">
        <Providers>
          <header className="border-b border-zinc-200">
            <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
              <Link href="/" className="text-xl font-bold text-zinc-900">
                Nemuzoo
              </Link>
              <nav className="flex items-center gap-6">
                <Link
                  href="/products"
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
                >
                  Products
                </Link>
                <Link
                  href="/cart"
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
                >
                  Cart
                </Link>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-zinc-200 py-8">
            <div className="max-w-6xl mx-auto px-4 text-center text-sm text-zinc-500">
              &copy; {new Date().getFullYear()} Nemuzoo. All rights reserved.
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
