"use client";

import Image from "next/image";
import { useState } from "react";

export type ProductGalleryImage = {
  id: string;
  publicUrl: string;
  alt_text: string | null;
  is_primary: boolean;
};

type ProductImageGalleryProps = {
  images: ProductGalleryImage[];
  productName: string;
  fallbackImage: string;
};

export default function ProductImageGallery({
  images,
  productName,
  fallbackImage,
}: ProductImageGalleryProps) {
  const galleryImages =
    images.length > 0
      ? images
      : [
          {
            id: "fallback",
            publicUrl: fallbackImage,
            alt_text: productName,
            is_primary: true,
          },
        ];

  const primaryImage =
    galleryImages.find((image) => image.is_primary) ??
    galleryImages[0];

  const [selectedImageId, setSelectedImageId] = useState(
    primaryImage.id
  );

  const selectedImage =
    galleryImages.find(
      (image) => image.id === selectedImageId
    ) ?? primaryImage;

  return (
    <div>
      <div className="overflow-hidden rounded-[2rem] border border-[#284239]/10 bg-white shadow-[0_18px_50px_rgba(42,66,57,0.12)]">
        <div className="relative aspect-square bg-[#f5f1ea] sm:aspect-[4/3]">
          <div
            key={selectedImage.id}
            className="pp-scale-in absolute inset-0"
          >
            <Image
              src={selectedImage.publicUrl}
              alt={selectedImage.alt_text ?? productName}
              fill
              priority
              unoptimized
              sizes="(max-width: 1023px) 100vw, 44vw"
              className="object-cover"
            />
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/10 to-transparent" />
        </div>
      </div>

      {galleryImages.length > 1 && (
        <div className="mt-4">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {galleryImages.map((image) => {
              const selected =
                image.id === selectedImage.id;

              return (
                <button
                  key={image.id}
                  type="button"
                  onClick={() =>
                    setSelectedImageId(image.id)
                  }
                  aria-label={`View ${
                    image.alt_text ?? productName
                  }`}
                  aria-pressed={selected}
                  className={`relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97] sm:w-24 ${
                    selected
                      ? "border-[#e76d61] shadow-sm"
                      : "border-transparent hover:border-[#284239]/20"
                  }`}
                >
                  <Image
                    src={image.publicUrl}
                    alt={image.alt_text ?? productName}
                    fill
                    unoptimized
                    sizes="96px"
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>

          <p className="mt-2 text-xs text-[#718078]">
            Tap an image to view it larger.
          </p>
        </div>
      )}
    </div>
  );
}
