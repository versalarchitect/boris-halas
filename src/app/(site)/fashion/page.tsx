export const dynamic = 'force-dynamic';

import { HorizontalGallery } from "@/components/horizontal-gallery";
import { getGalleryImages } from "@/lib/gallery";

export default async function FashionPage() {
  const images = await getGalleryImages('fashion');
  return <HorizontalGallery images={images} />;
}
