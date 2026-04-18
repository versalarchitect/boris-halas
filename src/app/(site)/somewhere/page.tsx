import { HorizontalGallery, GalleryImage } from "@/components/horizontal-gallery";

const galleryImages: GalleryImage[] = [
  { src: "/somewhere/0.jpg", alt: "Somewhere photo 0", width: 1229, height: 1818 },
  { src: "/somewhere/1.jpg", alt: "Somewhere photo 1", width: 2338, height: 1535 },
  { src: "/somewhere/2.jpg", alt: "Somewhere photo 2", width: 1818, height: 1229 },
  { src: "/somewhere/3.png", alt: "Somewhere photo 3", width: 2548, height: 3548 },
  { src: "/somewhere/4.jpg", alt: "Somewhere photo 4", width: 3024, height: 2005 },
  { src: "/somewhere/5.jpg", alt: "Somewhere photo 5", width: 1535, height: 2338 },
  { src: "/somewhere/6.jpg", alt: "Somewhere photo 6", width: 3024, height: 2005 },
  { src: "/somewhere/7.jpg", alt: "Somewhere photo 7", width: 3024, height: 2005 },
  { src: "/somewhere/8.jpg", alt: "Somewhere photo 8", width: 2433, height: 3629 },
  { src: "/somewhere/9.jpg", alt: "Somewhere photo 9", width: 3637, height: 2429 },
  { src: "/somewhere/10.jpg", alt: "Somewhere photo 10", width: 2432, height: 3636 },
  { src: "/somewhere/11.png", alt: "Somewhere photo 11", width: 3548, height: 2548 },
  { src: "/somewhere/12.jpg", alt: "Somewhere photo 12", width: 3637, height: 2429 },
  { src: "/somewhere/13.jpg", alt: "Somewhere photo 13", width: 1229, height: 1818 },
  { src: "/somewhere/14.jpg", alt: "Somewhere photo 14", width: 1818, height: 1229 },
  { src: "/somewhere/15.jpg", alt: "Somewhere photo 15", width: 1565, height: 1037 },
  { src: "/somewhere/16.jpg", alt: "Somewhere photo 16", width: 1535, height: 2338 },
  { src: "/somewhere/17.jpg", alt: "Somewhere photo 17", width: 2338, height: 1535 },
];

export default function SomewherePage() {
  return <HorizontalGallery images={galleryImages} />;
}
