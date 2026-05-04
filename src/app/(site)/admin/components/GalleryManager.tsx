'use client';

export interface GalleryImage {
  id: string;
  category: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  sort_order: number;
}

interface GalleryManagerProps {
  category: string;
  images: GalleryImage[];
  onImagesChange: (images: GalleryImage[]) => void;
  authToken: string;
}

export default function GalleryManager({
  category,
  images,
  onImagesChange,
  authToken,
}: GalleryManagerProps) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <p className="text-sm font-light text-gray-400 mb-2">
          {category.charAt(0).toUpperCase() + category.slice(1)} Gallery
        </p>
        <p className="text-xs font-light text-gray-300">
          {images.length} image{images.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}
