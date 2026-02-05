import { HorizontalGallery, GalleryImage } from "@/components/horizontal-gallery";

const galleryImages: GalleryImage[] = [
  { src: "/editorial/1.jpg", alt: "Editorial photo 1", width: 1535, height: 2291 },
  { src: "/editorial/2.jpg", alt: "Editorial photo 2", width: 2075, height: 3130 },
  { src: "/editorial/3.jpg", alt: "Editorial photo 3", width: 1535, height: 2279 },
  { src: "/editorial/4.jpg", alt: "Editorial photo 4", width: 2432, height: 3636 },
  { src: "/editorial/5.jpg", alt: "Editorial photo 5", width: 1535, height: 2279 },
  { src: "/editorial/6.jpg", alt: "Editorial photo 6", width: 1535, height: 2279 },
  { src: "/editorial/7.jpg", alt: "Editorial photo 7", width: 1535, height: 2279 },
  { src: "/editorial/8.jpg", alt: "Editorial photo 8", width: 1535, height: 2279 },
  { src: "/editorial/9.jpg", alt: "Editorial photo 9", width: 1535, height: 2291 },
  { src: "/editorial/10.jpg", alt: "Editorial photo 10", width: 3376, height: 5089 },
  { src: "/editorial/11.jpg", alt: "Editorial photo 11", width: 2432, height: 3636 },
  { src: "/editorial/12.jpg", alt: "Editorial photo 12", width: 2432, height: 3636 },
  { src: "/editorial/13.jpg", alt: "Editorial photo 13", width: 2433, height: 3575 },
  { src: "/editorial/14.jpg", alt: "Editorial photo 14", width: 1229, height: 1818 },
  { src: "/editorial/15.jpg", alt: "Editorial photo 15", width: 2048, height: 3090 },
  { src: "/editorial/16.jpg", alt: "Editorial photo 16", width: 2075, height: 3130 },
];

export default function EditorialPage() {
  return <HorizontalGallery images={galleryImages} />;
}
