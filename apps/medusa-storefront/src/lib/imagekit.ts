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

export function isLocalImagePath(src: string) {
  return (
    src.startsWith("/") &&
    !src.startsWith("/http://") &&
    !src.startsWith("/https://")
  );
}

const isAbsoluteUrl = (src: string) => /^https?:\/\//.test(src);

export function getImageKitSrc(src: string, urlEndpoint: string) {
  if (src.startsWith(`${urlEndpoint}/`)) {
    return src.slice(urlEndpoint.length);
  }

  if (src.startsWith("/http://") || src.startsWith("/https://")) {
    return `/${encodeURIComponent(src.slice(1))}`;
  }

  return isAbsoluteUrl(src) ? `/${encodeURIComponent(src)}` : src;
}
