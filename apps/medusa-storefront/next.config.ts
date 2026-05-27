import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const imageKitUrlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
const imageKitRemotePattern = imageKitUrlEndpoint
  ? (() => {
      try {
        const url = new URL(imageKitUrlEndpoint);

        return {
          protocol: url.protocol.replace(":", "") as "http" | "https",
          hostname: url.hostname,
        };
      } catch {
        return null;
      }
    })()
  : null;

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.r2.cloudflarestorage.com",
      },
      {
        protocol: "https",
        hostname: "static.nemuzoo.com",
      },
      {
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
      ...(imageKitRemotePattern ? [imageKitRemotePattern] : []),
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/auth/:path*",
        destination: `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/auth/:path*`,
      },
      {
        source: "/store/:path*",
        destination: `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/:path*`,
      },
    ];
  },
};

if (process.env.NODE_ENV === "development") {
  initOpenNextCloudflareForDev();
}

export default nextConfig;
