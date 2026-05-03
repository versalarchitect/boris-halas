import { HorizontalGallery } from "@/components/horizontal-gallery";
import { getGalleryImages } from "@/lib/gallery";

export default async function EditorialPage() {
  const images = await getGalleryImages('editorial');
  return <HorizontalGallery images={images} />;
}
