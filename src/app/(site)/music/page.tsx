import { HorizontalGallery } from "@/components/horizontal-gallery";
import { getGalleryImages } from "@/lib/gallery";

export default async function MusicPage() {
  const images = await getGalleryImages('music');
  return <HorizontalGallery images={images} />;
}
