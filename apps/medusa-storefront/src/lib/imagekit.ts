export function resolveImageKitEndpoint(value?: string) {
  if (!value) return null;

  try {
    const parsed = new URL(value);

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }

    return parsed.href.replace(/\/$/, "");
  } catch {
    return null;
  }
}

const imageKitProxyHosts = ["static.nemuzoo.com", "static-staging.nemuzoo.com"];

export function shouldProxyWithImageKit(src: string) {
  try {
    const parsed = new URL(src);

    return imageKitProxyHosts.includes(parsed.hostname);
  } catch {
    return false;
  }
}

export function getImageKitSrc(src: string) {
  try {
    const parsed = new URL(src);
    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return src;
  }
}
