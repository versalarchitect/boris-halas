import { HorizontalGallery, GalleryImage } from "@/components/horizontal-gallery";

const galleryImages: GalleryImage[] = [
  { src: "/fashion/1.jpg", alt: "Fashion photo 1", width: 2432, height: 3636 },
  { src: "/fashion/2.jpg", alt: "Fashion photo 2", width: 2432, height: 3636 },
  { src: "/fashion/3.jpg", alt: "Fashion photo 3", width: 2432, height: 3636 },
  { src: "/fashion/4.jpg", alt: "Fashion photo 4", width: 2432, height: 3636 },
  { src: "/fashion/5.jpg", alt: "Fashion photo 5", width: 2432, height: 3636 },
  { src: "/fashion/6.jpg", alt: "Fashion photo 6", width: 2432, height: 3636 },
  { src: "/fashion/7.jpg", alt: "Fashion photo 7", width: 2432, height: 3636 },
  { src: "/fashion/8.jpg", alt: "Fashion photo 8", width: 2432, height: 3636 },
  { src: "/fashion/9.jpg", alt: "Fashion photo 9", width: 2432, height: 3636 },
  { src: "/fashion/10.jpg", alt: "Fashion photo 10", width: 2432, height: 3636 },
  { src: "/fashion/11.jpg", alt: "Fashion photo 11", width: 2432, height: 3636 },
  { src: "/fashion/12.jpg", alt: "Fashion photo 12", width: 2432, height: 3636 },
  { src: "/fashion/13.jpg", alt: "Fashion photo 13", width: 2432, height: 3636 },
  { src: "/fashion/14.jpg", alt: "Fashion photo 14", width: 2432, height: 3636 },
  { src: "/fashion/16.jpg", alt: "Fashion photo 16", width: 2432, height: 3636 },
  { src: "/fashion/17.jpg", alt: "Fashion photo 17", width: 3636, height: 2432 },
  { src: "/fashion/18.jpg", alt: "Fashion photo 18", width: 2432, height: 3636 },
  { src: "/fashion/19.jpg", alt: "Fashion photo 19", width: 1535, height: 2338 },
  { src: "/fashion/20.jpg", alt: "Fashion photo 20", width: 1535, height: 2279 },
  { src: "/fashion/21.jpg", alt: "Fashion photo 21", width: 2075, height: 3130 },
  { src: "/fashion/22.jpg", alt: "Fashion photo 22", width: 3091, height: 2048 },
  { src: "/fashion/23.jpg", alt: "Fashion photo 23", width: 2432, height: 3636 },
  { src: "/fashion/24.jpg", alt: "Fashion photo 24", width: 2432, height: 3636 },
];

export default function FashionPage() {
  return <HorizontalGallery images={galleryImages} />;
}
