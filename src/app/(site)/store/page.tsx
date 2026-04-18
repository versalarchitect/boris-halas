import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/products";
import { StoreScroller } from "./store-scroller";

export default function StorePage() {
  return (
    <StoreScroller>
      {products.map((product, i) => {
        const cover = product.images[0];
        const isSoldOut = product.status === "sold-out";
        return (
          <Link
            key={product.id}
            href={`/store/${product.id}`}
            className="group relative flex h-full w-[60vw] max-w-[360px] flex-shrink-0 flex-col font-hn sm:w-[40vw] md:w-[28vw] lg:w-[22vw]"
          >
            <div className="relative min-h-0 flex-1 overflow-hidden">
              <Image
                src={`/products/${product.id}/${cover.src}`}
                alt={product.title}
                fill
                className="object-contain transition-opacity duration-500 group-hover:opacity-90"
                sizes="(max-width: 640px) 60vw, (max-width: 768px) 40vw, (max-width: 1024px) 28vw, 22vw"
                priority={i === 0}
                quality={85}
              />
              {isSoldOut && (
                <span className="absolute left-3 top-3 bg-black px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                  Sold out
                </span>
              )}
            </div>
            <div className="mt-2 flex items-center justify-between gap-2 px-1">
              <span className="text-[12px] font-bold leading-[1.5] text-black">
                {product.title}
              </span>
              <span className="text-[11px] leading-[1.5] text-[#888]">
                {isSoldOut ? "—" : `€${product.price}`}
              </span>
            </div>
          </Link>
        );
      })}
    </StoreScroller>
  );
}
