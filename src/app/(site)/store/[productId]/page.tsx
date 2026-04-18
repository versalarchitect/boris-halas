import { Metadata } from "next";
import { notFound } from "next/navigation";
import { products, getProduct } from "@/lib/products";
import { ProductView } from "./product-view";

type Props = {
  params: Promise<{ productId: string }>;
};

export function generateStaticParams() {
  return products.map((p) => ({ productId: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productId } = await params;
  const product = getProduct(productId);

  if (!product) {
    return { title: "Boris Halas — Store" };
  }

  return {
    title: `${product.title} — Boris Halas`,
    description: " ",
    openGraph: {
      title: `${product.title} — Boris Halas`,
      description: " ",
      images: [`/products/${product.id}/${product.images[0]}`],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { productId } = await params;
  const product = getProduct(productId);

  if (!product) notFound();

  return <ProductView product={product} />;
}
