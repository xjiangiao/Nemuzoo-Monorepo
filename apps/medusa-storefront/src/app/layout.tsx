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
    default: "Nemuzoo — Everyday Cultural Goods",
    template: "%s | Nemuzoo",
  },
  description:
    "Quiet cultural goods for reading, writing, storage, and simple daily routines. The first Nemuzoo edition begins with a book annotation kit.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Nemuzoo",
    title: "Nemuzoo — Everyday Cultural Goods",
    description:
      "Quiet cultural goods for reading, writing, storage, and simple daily routines. The first Nemuzoo edition begins with a book annotation kit.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      {
        url: "/nemuzoo-icon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/nemuzoo-icon-32.png",
        type: "image/png",
        sizes: "32x32",
      },
      {
        url: "/nemuzoo-icon-16.png",
        type: "image/png",
        sizes: "16x16",
      },
    ],
    shortcut: "/nemuzoo-icon-32.png",
    apple: "/nemuzoo-apple-touch-icon.png",
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
    <html
      lang="en"
      className={cn("h-full antialiased", "font-sans")}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-surface-primary font-body text-text-primary">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Nemuzoo",
              url: siteUrl,
              description:
                "Quiet cultural goods for reading, writing, storage, and simple daily routines.",
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
