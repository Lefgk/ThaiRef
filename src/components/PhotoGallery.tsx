"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface PhotoGalleryProps {
  images: string[];
  mainImage: string;
  alt: string;
}

export default function PhotoGallery({ images, mainImage, alt }: PhotoGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const t = useTranslations("common.gallery");

  const allImages = [mainImage, ...images];

  const openLightbox = (index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  };

  const navigate = (dir: -1 | 1) => {
    setActiveIndex((prev) => (prev + dir + allImages.length) % allImages.length);
  };

  if (images.length === 0) return null;

  return (
    <>
      {/* Thumbnail strip */}
      <div className="flex gap-2 mt-3">
        {images.slice(0, 3).map((img, i) => (
          <button
            key={i}
            onClick={() => openLightbox(i + 1)}
            className="relative w-20 h-16 rounded-lg overflow-hidden border border-border hover:border-accent-cyan/50 transition-colors"
          >
            <Image
              src={img}
              alt={`${alt} - photo ${i + 2}`}
              fill
              sizes="80px"
              className="object-cover"
            />
            {i === 2 && images.length > 3 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-medium">
                +{images.length - 2}
              </div>
            )}
          </button>
        ))}
        <button
          onClick={() => openLightbox(0)}
          className="px-3 py-1 text-xs text-gray-400 border border-border rounded-lg hover:border-accent-cyan/30 hover:text-white transition-colors"
        >
          {t("viewAll")}
        </button>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90">
          {/* Close */}
          <button
            onClick={() => setLightboxOpen(false)}
            aria-label={t("close")}
            className="absolute top-4 right-4 z-10 p-2 text-white/70 hover:text-white transition-colors"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-4 text-sm text-white/60">
            {t("photo", { current: (activeIndex + 1).toString(), total: allImages.length.toString() })}
          </div>

          {/* Prev */}
          <button
            onClick={() => navigate(-1)}
            aria-label="Previous photo"
            className="absolute left-4 p-2 text-white/70 hover:text-white transition-colors"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Image */}
          <div className="relative w-full max-w-4xl h-[70vh] mx-16">
            <Image
              src={allImages[activeIndex]}
              alt={`${alt} - photo ${activeIndex + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          {/* Next */}
          <button
            onClick={() => navigate(1)}
            aria-label="Next photo"
            className="absolute right-4 p-2 text-white/70 hover:text-white transition-colors"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
