import { supabase } from './supabase';

export interface GalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export type GalleryCategory = 'around' | 'fashion' | 'editorial' | 'music' | 'somewhere';

export async function getGalleryImages(category: GalleryCategory): Promise<GalleryImage[]> {
  const { data, error } = await supabase
    .from('bh_gallery_images')
    .select('src, alt, width, height')
    .eq('category', category)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error(`Failed to fetch ${category} gallery:`, error);
    return [];
  }

  return data ?? [];
}
