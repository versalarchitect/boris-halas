"use client";

import { useEffect, useRef } from "react";

interface StoreScrollerProps {
  children: React.ReactNode;
}

export function StoreScroller({ children }: StoreScrollerProps) {
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
      className="flex h-full items-stretch gap-2 overflow-x-auto overflow-y-hidden px-[3px] pb-2 scrollbar-hide md:gap-3 md:px-0"
    >
      {children}
    </div>
  );
}
