import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/lib/providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Nemuzoo — Nighttime Companions",
  description:
    "Knitted dolls for quiet nights and gentle hearts. Each Nemuzoo doll is a handmade emotional companion, ready to be the friend you hold tight before falling asleep.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[var(--color-surface-primary)] text-[var(--color-text-primary)] font-[var(--font-body)]">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
