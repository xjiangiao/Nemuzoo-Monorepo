import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import { resolveImageKitEndpoint } from "./src/lib/imagekit";

const imageKitUrlEndpoint = resolveImageKitEndpoint(
  process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
);
const imageKitRemotePattern = imageKitUrlEndpoint
  ? (() => {
      const url = new URL(imageKitUrlEndpoint);
      const protocol: "http" | "https" =
        url.protocol === "http:" ? "http" : "https";

      return {
        protocol,
        hostname: url.hostname,
      };
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
        hostname: "static-staging.nemuzoo.com",
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
    const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
    return [
      {
        source: "/auth/:path*",
        destination: `${backendUrl}/auth/:path*`,
      },
      {
        source: "/store/:path*",
        destination: `${backendUrl}/store/:path*`,
      },
    ];
  },
};

if (process.env.NODE_ENV === "development") {
  initOpenNextCloudflareForDev();
}

export default nextConfig;
