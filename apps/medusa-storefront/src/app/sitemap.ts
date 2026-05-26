import type { MetadataRoute } from "next";
import { execSync } from "child_process";

const BASE_URL = "https://www.nemuzoo.com";
const BUILD_DATE = execSync("git log -1 --format=%as").toString().trim();
const SITE_LAUNCH = new Date(BUILD_DATE);

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL, lastModified: SITE_LAUNCH, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/products`, lastModified: SITE_LAUNCH, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: SITE_LAUNCH, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/cart`, changeFrequency: "never", priority: 0.3 },
  ];
}
