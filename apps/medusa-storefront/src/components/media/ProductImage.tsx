import Image from "next/image";
import { Image as ImageKitImage } from "@imagekit/next";
import type { IKImageProps, Transformation } from "@imagekit/next";

type ProductImageProps = Omit<
  IKImageProps,
  | "src"
  | "urlEndpoint"
  | "transformation"
  | "transformationPosition"
  | "queryParameters"
> & {
  src: string;
  transformation?: Transformation[];
};

const imageKitUrlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

const isAbsoluteUrl = (src: string) => /^https?:\/\//.test(src);

const getImageKitSrc = (src: string) => {
  if (src.startsWith("/http://") || src.startsWith("/https://")) {
    return `/${encodeURIComponent(src.slice(1))}`;
  }

  return isAbsoluteUrl(src) ? `/${encodeURIComponent(src)}` : src;
};

export default function ProductImage({
  src,
  transformation,
  ...props
}: ProductImageProps) {
  if (!imageKitUrlEndpoint) {
    return <Image src={src} {...props} />;
  }

  return (
    <ImageKitImage
      src={getImageKitSrc(src)}
      transformation={transformation}
      urlEndpoint={imageKitUrlEndpoint}
      {...props}
    />
  );
}
