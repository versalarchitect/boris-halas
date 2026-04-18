import { HorizontalGallery, GalleryImage } from "@/components/horizontal-gallery";

const galleryImages: GalleryImage[] = [
  { src: "/around/1.jpg", alt: "Around photo 1", width: 2338, height: 1535 },
  { src: "/around/2.jpg", alt: "Around photo 2", width: 2433, height: 3629 },
  { src: "/around/3.jpg", alt: "Around photo 3", width: 2929, height: 2043 },
  { src: "/around/4.jpg", alt: "Around photo 4", width: 2433, height: 3629 },
  { src: "/around/5.jpg", alt: "Around photo 5", width: 4535, height: 3118 },
  { src: "/around/6.jpg", alt: "Around photo 6", width: 1535, height: 2291 },
  { src: "/around/7.jpg", alt: "Around photo 7", width: 2548, height: 3548 },
  { src: "/around/8.jpg", alt: "Around photo 8", width: 2005, height: 3024 },
  { src: "/around/9.jpg", alt: "Around photo 9", width: 2432, height: 3637 },
  { src: "/around/10.jpg", alt: "Around photo 10", width: 2075, height: 3130 },
  { src: "/around/11.jpg", alt: "Around photo 11", width: 2075, height: 3130 },
  { src: "/around/12.jpg", alt: "Around photo 12", width: 2429, height: 3637 },
  { src: "/around/14.jpg", alt: "Around photo 14", width: 3130, height: 2075 },
  { src: "/around/15.jpg", alt: "Around photo 15", width: 2063, height: 3480 },
  { src: "/around/16.jpg", alt: "Around photo 16", width: 2279, height: 1535 },
  { src: "/around/17.jpg", alt: "Around photo 17", width: 2279, height: 1535 },
  { src: "/around/18.jpg", alt: "Around photo 18", width: 2075, height: 3130 },
  { src: "/around/19.jpg", alt: "Around photo 19", width: 1229, height: 1818 },
];

export default function AroundPage() {
  return <HorizontalGallery images={galleryImages} />;
}
