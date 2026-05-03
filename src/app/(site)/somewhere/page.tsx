import { HorizontalGallery } from "@/components/horizontal-gallery";
import { getGalleryImages } from "@/lib/gallery";

export default async function SomewherePage() {
  const images = await getGalleryImages('somewhere');
  return <HorizontalGallery images={images} />;
}
