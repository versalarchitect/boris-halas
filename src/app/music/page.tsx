import { HorizontalGallery, GalleryImage } from "@/components/horizontal-gallery";

const galleryImages: GalleryImage[] = [
  { src: "/music/1.jpg", alt: "Music photo 1", width: 1229, height: 1818 },
  { src: "/music/2.jpg", alt: "Music photo 2", width: 1535, height: 2279 },
  { src: "/music/3.jpg", alt: "Music photo 3", width: 2432, height: 3636 },
  { src: "/music/4.jpg", alt: "Music photo 4", width: 2075, height: 3130 },
  { src: "/music/5.jpg", alt: "Music photo 5", width: 1229, height: 1818 },
  { src: "/music/6.jpg", alt: "Music photo 6", width: 1535, height: 2279 },
  { src: "/music/7.jpg", alt: "Music photo 7", width: 2432, height: 3636 },
  { src: "/music/8.jpg", alt: "Music photo 8", width: 1535, height: 2279 },
  { src: "/music/9.jpg", alt: "Music photo 9", width: 2432, height: 3636 },
  { src: "/music/10.jpg", alt: "Music photo 10", width: 1229, height: 1818 },
  { src: "/music/11.jpg", alt: "Music photo 11", width: 2043, height: 2929 },
  { src: "/music/12.jpg", alt: "Music photo 12", width: 2043, height: 2929 },
  { src: "/music/13.jpg", alt: "Music photo 13", width: 2075, height: 3130 },
  { src: "/music/14.jpg", alt: "Music photo 14", width: 2432, height: 3636 },
  { src: "/music/15.jpg", alt: "Music photo 15", width: 2075, height: 3130 },
  { src: "/music/16.jpg", alt: "Music photo 16", width: 4011, height: 6048 },
  { src: "/music/17.jpg", alt: "Music photo 17", width: 1229, height: 1818 },
  { src: "/music/18.jpg", alt: "Music photo 18", width: 2075, height: 3130 },
  { src: "/music/19.jpg", alt: "Music photo 19", width: 2432, height: 3636 },
];

export default function MusicPage() {
  return <HorizontalGallery images={galleryImages} />;
}
