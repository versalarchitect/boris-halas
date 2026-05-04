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
            className="group relative h-full flex-shrink-0 snap-start font-hn"
          >
            <div className="relative h-full">
              <Image
                src={resolveProductImageSrc(product.id, cover)}
                alt={product.title}
                width={cover.width}
                height={cover.height}
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
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/90 to-transparent pt-6 pb-1">
                <span className="text-[12px] font-bold leading-[1.5] text-black">
                  {product.title}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </StoreScroller>
  );
}
