"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/products";
import { Lightbox, type LightboxItem } from "./lightbox";

interface ProductViewProps {
  product: Product;
}

export function ProductView({ product }: ProductViewProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const isSoldOut = product.status === "sold-out";
  const current = product.images[activeIndex];
  const hasMany = product.images.length > 1;

  const lightboxItems = useMemo<LightboxItem[]>(
    () =>
      product.images.map((image) => ({
        productId: product.id,
        image: image.src,
        width: image.width,
        height: image.height,
        title: product.title,
      })),
    [product.id, product.images, product.title]
  );

  const prev = () =>
    setActiveIndex((i) => (i === 0 ? product.images.length - 1 : i - 1));
  const next = () => setActiveIndex((i) => (i + 1) % product.images.length);

  const handleInquire = () => {
    const subject = encodeURIComponent(`Inquiry — ${product.title}`);
    window.location.href = `mailto:borishalasphoto@gmail.com?subject=${subject}`;
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-white pb-4 pt-24 font-hn md:static md:z-auto md:h-full md:flex-row md:overflow-hidden md:pb-0 md:pt-0">
      {/* Image gallery */}
      <div className="flex flex-shrink-0 flex-col md:h-full md:w-1/2 md:flex-1 md:min-w-0">
        {/* Main image — image drives container size on mobile, fits strip on desktop */}
        <div className="relative w-full md:flex md:min-h-0 md:flex-1 md:items-center md:justify-center md:p-4">
          <button
            type="button"
            aria-label="Expand image"
            onClick={() => setLightboxOpen(true)}
            className="group relative block w-full cursor-zoom-in md:flex md:h-full md:w-full md:items-center md:justify-center"
          >
            <Image
              key={`${product.id}-${current.src}`}
              src={`/products/${product.id}/${current.src}`}
              alt={`${product.title} — image ${activeIndex + 1}`}
              width={current.width}
              height={current.height}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              quality={85}
              className="block h-auto w-full object-contain md:h-full md:max-h-full md:w-auto md:max-w-full"
            />
          </button>
          {hasMany && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center text-black/60 transition-colors hover:text-black"
              >
                <ChevronLeft className="h-6 w-6" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next image"
                className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center text-black/60 transition-colors hover:text-black"
              >
                <ChevronRight className="h-6 w-6" strokeWidth={2} />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail strip — horizontally scrollable if many images */}
        {hasMany && (
          <div className="flex flex-shrink-0 gap-2 overflow-x-auto overflow-y-hidden px-4 py-3 scrollbar-hide md:px-0 md:pt-2">
            {product.images.map((img, i) => (
              <button
                key={img.src}
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-label={`Show image ${i + 1}`}
                className={`relative h-14 w-14 flex-shrink-0 cursor-pointer overflow-hidden border transition md:h-14 md:w-14 ${
                  i === activeIndex
                    ? "border-black"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={`/products/${product.id}/${img.src}`}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info panel */}
      <div className="flex flex-shrink-0 flex-col gap-3 px-4 pb-6 pt-3 md:h-full md:w-1/2 md:max-w-md md:flex-1 md:min-w-0 md:flex-shrink md:gap-4 md:overflow-y-auto md:px-6 md:py-2">
        <div className="flex items-center gap-2">
          <Link
            href="/store"
            className="text-[11px] leading-[1.5] text-[#888] underline-offset-2 hover:underline"
          >
            ← Store
          </Link>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-wider text-[#888]">
            {product.category}
          </p>
          <h1 className="mt-1 text-lg font-bold leading-tight text-black md:text-xl">
            {product.title}
          </h1>
          <p className="mt-1 text-[11px] text-[#888]">{product.productCode}</p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`inline-block px-2 py-1 text-[10px] font-semibold uppercase tracking-wider ${
              isSoldOut
                ? "bg-black text-white"
                : "border border-black bg-white text-black"
            }`}
          >
            {isSoldOut ? "Sold out" : "In stock"}
          </span>
          {!isSoldOut && (
            <span className="text-[14px] font-bold text-black">
              €{product.price}.00
            </span>
          )}
        </div>

        <p className="text-[12px] leading-[1.6] text-black">
          {product.description}
        </p>

        <button
          type="button"
          onClick={handleInquire}
          disabled={isSoldOut}
          className={`w-full border border-black py-3 text-[11px] font-bold uppercase tracking-widest transition ${
            isSoldOut
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer bg-black text-white hover:bg-white hover:text-black"
          }`}
        >
          {isSoldOut ? "Unavailable" : "Inquire"}
        </button>

        <Accordion title="Details">
          <p className="text-[12px] leading-[1.6] text-black">
            {product.longDescription}
          </p>
          <ul className="mt-3 space-y-1">
            {product.features.map((feature) => (
              <li
                key={feature}
                className="text-[11px] leading-[1.6] text-[#888]"
              >
                — {feature}
              </li>
            ))}
          </ul>
        </Accordion>

        <Accordion title="Specifications">
          <div className="space-y-1">
            {product.specifications.map((spec, i) =>
              spec === "" ? (
                <div key={i} className="h-2" />
              ) : (
                <p
                  key={i}
                  className="text-[11px] leading-[1.6] text-[#888]"
                >
                  {spec}
                </p>
              )
            )}
          </div>
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[11px]">
            <dt className="font-bold text-black">Weight</dt>
            <dd className="text-[#888]">{product.weight}</dd>
            <dt className="font-bold text-black">Dimensions</dt>
            <dd className="text-[#888]">{product.dimensions}</dd>
            <dt className="font-bold text-black">Materials</dt>
            <dd className="text-[#888]">{product.materials.join(", ")}</dd>
          </dl>
        </Accordion>

        <Accordion title="Care">
          <p className="text-[11px] leading-[1.6] text-[#888]">
            {product.careInstructions}
          </p>
        </Accordion>
      </div>

      {lightboxOpen && (
        <Lightbox
          items={lightboxItems}
          startIndex={activeIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}

function Accordion({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-neutral-200">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-between py-2 text-left"
      >
        <span className="text-[12px] font-bold text-black">{title}</span>
        <span className="text-[12px] text-black">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  );
}
