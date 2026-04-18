"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export interface LightboxItem {
  productId: string;
  image: string;
  width: number;
  height: number;
  title: string;
}

interface LightboxProps {
  items: LightboxItem[];
  startIndex: number;
  onClose: () => void;
}

export function Lightbox({ items, startIndex, onClose }: LightboxProps) {
  const [index, setIndex] = useState(startIndex);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const frameRef = useRef<HTMLDivElement>(null);

  const current = items[index];

  const next = useCallback(
    () => setIndex((i) => (i + 1) % items.length),
    [items.length]
  );
  const prev = useCallback(
    () => setIndex((i) => (i === 0 ? items.length - 1 : i - 1)),
    [items.length]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, onClose]);

  useEffect(() => {
    setZoomed(false);
    setOrigin({ x: 50, y: 50 });
  }, [index]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const handleMove = (e: React.MouseEvent) => {
    if (!zoomed || !frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin({ x, y });
  };

  const toggleZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (frameRef.current) {
      const rect = frameRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setOrigin({ x, y });
    }
    setZoomed((v) => !v);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center font-hn">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-white/70 backdrop-blur-md"
      />

      {/* Image frame — image drives display size */}
      <div
        ref={frameRef}
        onClick={toggleZoom}
        onMouseMove={handleMove}
        className={`relative z-10 flex h-[88vh] w-[92vw] items-center justify-center overflow-hidden ${
          zoomed ? "cursor-zoom-out" : "cursor-zoom-in"
        }`}
      >
        <div
          className="flex h-full w-full items-center justify-center transition-transform duration-300 ease-out"
          style={{
            transform: zoomed ? "scale(2.25)" : "scale(1)",
            transformOrigin: `${origin.x}% ${origin.y}%`,
          }}
        >
          <Image
            key={`${current.productId}/${current.image}`}
            src={`/products/${current.productId}/${current.image}`}
            alt={current.title}
            width={current.width}
            height={current.height}
            sizes="92vw"
            quality={90}
            priority
            className="h-auto max-h-full w-auto max-w-full object-contain"
          />
        </div>
      </div>

      {/* Close */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute right-4 top-4 z-20 flex h-10 w-10 cursor-pointer items-center justify-center text-black/70 transition-colors hover:text-black"
      >
        <X className="h-6 w-6" strokeWidth={2} />
      </button>

      {/* Prev */}
      <button
        type="button"
        aria-label="Previous"
        onClick={(e) => {
          e.stopPropagation();
          prev();
        }}
        className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center text-black/70 transition-colors hover:text-black"
      >
        <ChevronLeft className="h-6 w-6" strokeWidth={2} />
      </button>

      {/* Next */}
      <button
        type="button"
        aria-label="Next"
        onClick={(e) => {
          e.stopPropagation();
          next();
        }}
        className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center text-black/70 transition-colors hover:text-black"
      >
        <ChevronRight className="h-6 w-6" strokeWidth={2} />
      </button>

      {/* Caption */}
      <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 text-center text-[11px] leading-[1.5] text-[#888]">
        {current.title} — {index + 1} / {items.length}
      </div>
    </div>
  );
}
