import Image from "next/image";
import { Image as ImageKitImage } from "@imagekit/next";
import type { IKImageProps, Transformation } from "@imagekit/next";
import {
  getImageKitSrc,
  resolveImageKitEndpoint,
  shouldProxyWithImageKit,
} from "@/lib/imagekit";

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

const imageKitUrlEndpoint = resolveImageKitEndpoint(
  process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
);

export default function ProductImage({
  src,
  transformation,
  ...props
}: ProductImageProps) {
  if (!imageKitUrlEndpoint || !shouldProxyWithImageKit(src)) {
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
