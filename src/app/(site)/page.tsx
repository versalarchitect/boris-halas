import { HorizontalGallery } from "@/components/horizontal-gallery";
import { getGalleryImages } from "@/lib/gallery";

export default async function AroundPage() {
  const images = await getGalleryImages('around');
  return <HorizontalGallery images={images} />;
}
