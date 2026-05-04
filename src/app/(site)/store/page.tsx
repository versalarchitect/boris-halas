export const dynamic = 'force-dynamic';

import Image from "next/image";
import Link from "next/link";
import { getProducts, resolveProductImageSrc } from "@/lib/products";
import { StoreScroller } from "./store-scroller";

export default async function StorePage() {
  const products = await getProducts();
  return (
    <StoreScroller>
      {products.map((product, i) => {
        const cover = product.images[0];
        const isSoldOut = product.status === "sold-out";
        return (
          <Link
            key={product.id}
            href={`/store/${product.id}`}
            className="group relative flex h-full flex-shrink-0 snap-start flex-col overflow-hidden font-hn"
          >
            <div className="relative min-h-0 flex-1 overflow-hidden">
              <Image
                src={resolveProductImageSrc(product.id, cover)}
                alt={product.title}
                width={600}
                height={900}
                className="h-full w-auto transition-opacity duration-500 group-hover:opacity-90"
                sizes="(max-width: 640px) 60vw, (max-width: 768px) 40vw, (max-width: 1024px) 28vw, 22vw"
                priority={i === 0}
                quality={85}
              />
              {isSoldOut && (
                <span className="absolute left-0 top-0 bg-black px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                  Sold out
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold leading-[1.5] text-black">
                {product.title}
              </span>
              {!isSoldOut && (
                <span className="text-[11px] leading-[1.5] text-[#888]">
                  €{product.price}
                </span>
              )}
            </div>
          </Link>
        );
      })}
    </StoreScroller>
  );
}
