"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";

export interface GalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

interface HorizontalGalleryProps {
  images: GalleryImage[];
}

export function HorizontalGallery({ images }: HorizontalGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      container.scrollLeft += delta;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const scrollAmount = 300;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        container.scrollLeft += scrollAmount;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        container.scrollLeft -= scrollAmount;
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex h-full gap-[3px] overflow-x-auto overflow-y-hidden px-[3px] scrollbar-hide md:px-0"
    >
      {images.map((image, index) => (
        <div
          key={index}
          className="relative h-full flex-shrink-0"
        >
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            className="h-full w-auto"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 75vw, (max-width: 1536px) 50vw, 33vw"
            priority={index < 3}
            quality={85}
          />
          {image.caption && (
            <div className="absolute bottom-0 left-0 p-4">
              <p className="text-sm text-white/80 font-light tracking-wide [writing-mode:vertical-rl] rotate-180">
                {image.caption}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
