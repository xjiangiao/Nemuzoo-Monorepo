import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/lib/providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

const siteUrl = "https://www.nemuzoo.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F7F5F0",
};

export const metadata: Metadata = {
  title: {
    default: "Nemuzoo — Nighttime Companions",
    template: "%s | Nemuzoo",
  },
  description:
    "Knitted dolls for quiet nights and gentle hearts. Each Nemuzoo doll is a handmade emotional companion, ready to be the friend you hold tight before falling asleep.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Nemuzoo",
    title: "Nemuzoo — Nighttime Companions",
    description:
      "Knitted dolls for quiet nights and gentle hearts. Each Nemuzoo doll is a handmade emotional companion, ready to be the friend you hold tight before falling asleep.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon-inverted.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

/**
 * Defines the application's root HTML layout including global metadata, site shell, and providers.
 *
 * Renders the <html> and <body> wrappers, injects site Organization JSON-LD, and composes the page shell
 * with Providers, Header, main content area, and Footer.
 *
 * @param children - Routed page content to render inside the layout's main area between header and footer
 * @returns The root HTML element for the application layout
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full antialiased", "font-sans")}>
      <body className="min-h-full flex flex-col bg-surface-primary text-text-primary font-body">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Nemuzoo",
              url: siteUrl,
              description:
                "Knitted companions for quiet nights and gentle hearts.",
            }),
          }}
        />
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
