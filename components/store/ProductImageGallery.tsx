"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ProductImageGalleryProps {
  images: string[];
  alt: string;
  discountBadge?: React.ReactNode;
}

const ZOOM_IN_CURSOR = `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><circle cx='12' cy='12' r='10' fill='white' stroke='%231E1A2E' stroke-width='2'/><line x1='19' y1='19' x2='28' y2='28' stroke='%231E1A2E' stroke-width='3' stroke-linecap='round'/><line x1='8' y1='12' x2='16' y2='12' stroke='%231E1A2E' stroke-width='2'/><line x1='12' y1='8' x2='12' y2='16' stroke='%231E1A2E' stroke-width='2'/></svg>") 12 12, zoom-in`;

const ZOOM_OUT_CURSOR = `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><circle cx='12' cy='12' r='10' fill='white' stroke='%231E1A2E' stroke-width='2'/><line x1='19' y1='19' x2='28' y2='28' stroke='%231E1A2E' stroke-width='3' stroke-linecap='round'/><line x1='8' y1='12' x2='16' y2='12' stroke='%231E1A2E' stroke-width='2'/></svg>") 12 12, zoom-out`;

export function ProductImageGallery({ images, alt, discountBadge }: ProductImageGalleryProps) {
  const [lockedIndex, setLockedIndex] = useState(0);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const displayIndex = previewIndex ?? lockedIndex;

  // Reset zoom when displayed image changes
  useEffect(() => {
    setIsZoomed(false);
    if (imageRef.current) {
      imageRef.current.style.transformOrigin = "50% 50%";
    }
  }, [displayIndex]);

  // Touch pan: attach non-passive listener to allow preventDefault
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function handleTouchMove(e: TouchEvent) {
      if (!isZoomed || !containerRef.current || !imageRef.current) return;
      e.preventDefault();
      const touch = e.touches[0];
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((touch.clientY - rect.top) / rect.height) * 100));
      imageRef.current.style.transformOrigin = `${x}% ${y}%`;
    }

    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => container.removeEventListener("touchmove", handleTouchMove);
  }, [isZoomed]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isZoomed || !containerRef.current || !imageRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
      imageRef.current.style.transformOrigin = `${x}% ${y}%`;
    },
    [isZoomed],
  );

  const handleMainImageClick = useCallback(
    (e: React.MouseEvent) => {
      if (!isZoomed && containerRef.current && imageRef.current) {
        // Set initial transform-origin to click position
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        imageRef.current.style.transformOrigin = `${x}% ${y}%`;
      }
      setIsZoomed((z) => !z);
    },
    [isZoomed],
  );

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div
        ref={containerRef}
        onClick={handleMainImageClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          if (isZoomed) setIsZoomed(false);
        }}
        className="relative aspect-square rounded-3xl overflow-hidden bg-brand-mist select-none"
        style={{ cursor: isZoomed ? ZOOM_OUT_CURSOR : ZOOM_IN_CURSOR }}
      >
        {/* Base layer: locked image with fade transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={lockedIndex}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            ref={previewIndex === null || previewIndex === lockedIndex ? imageRef : undefined}
            className="absolute inset-0"
            style={{
              transform: isZoomed && (previewIndex === null || previewIndex === lockedIndex) ? "scale(1.5)" : "scale(1)",
              transition: "transform 0.3s ease-out",
            }}
          >
            {images[lockedIndex] ? (
              <Image
                src={images[lockedIndex]}
                alt={alt}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                draggable={false}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-8xl text-brand-purple/20">&#9829;</span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Preview overlay: shown instantly during thumbnail hover */}
        {previewIndex !== null && previewIndex !== lockedIndex && images[previewIndex] && (
          <div
            ref={imageRef}
            className="absolute inset-0 z-10"
            style={{
              transform: isZoomed ? "scale(1.5)" : "scale(1)",
              transition: "transform 0.3s ease-out",
            }}
          >
            <Image
              src={images[previewIndex]}
              alt={alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              draggable={false}
            />
          </div>
        )}

        {/* Discount badge */}
        {discountBadge && <div className="z-20 pointer-events-none">{discountBadge}</div>}
      </div>

      {/* Thumbnail row */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {images.slice(0, 8).map((img, i) => (
            <button
              key={i}
              onMouseEnter={() => setPreviewIndex(i)}
              onMouseLeave={() => setPreviewIndex(null)}
              onClick={() => {
                setLockedIndex(i);
                setPreviewIndex(null);
              }}
              className={`relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden transition-all ${
                displayIndex === i
                  ? "ring-2 ring-brand-coral ring-offset-2"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`${alt} view ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
