import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase, STORAGE_BUCKET, getImageUrl } from "@/lib/supabase";
import { checkAdminAuth } from '../auth-check';
import { products } from "@/lib/products";

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

function getContentType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  return MIME_TYPES[ext] ?? 'application/octet-stream';
}

export async function POST(request: NextRequest) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  try {
    const client = supabase;
    let seededCount = 0;

    for (let i = 0; i < products.length; i++) {
      const product = products[i];

      // Insert product
      const { error: productError } = await client
        .from('bh_products')
        .upsert({
          id: product.id,
          title: product.title,
          category: product.category,
          product_code: product.productCode,
          status: product.status,
          price: product.price,
          currency: product.currency,
          description: product.description,
          long_description: product.longDescription,
          specifications: product.specifications,
          features: product.features,
          tags: product.tags,
          weight: product.weight,
          dimensions: product.dimensions,
          materials: product.materials,
          care_instructions: product.careInstructions,
          sort_order: i,
        });

      if (productError) {
        return NextResponse.json(
          { error: `Failed to insert product ${product.id}: ${productError.message}` },
          { status: 500 }
        );
      }

      // Upload each image
      for (let j = 0; j < product.images.length; j++) {
        const filename = product.images[j];
        const filePath = path.join(process.cwd(), 'public', 'products', product.id, filename);

        if (!fs.existsSync(filePath)) {
          console.warn(`Image file not found: ${filePath}`);
          continue;
        }

        const fileBuffer = fs.readFileSync(filePath);
        const contentType = getContentType(filename);
        const storagePath = `${product.id}/${filename}`;

        // Upload to storage
        const { error: uploadError } = await client.storage
          .from(STORAGE_BUCKET)
          .upload(storagePath, fileBuffer, {
            contentType,
            upsert: true,
          });

        if (uploadError) {
          console.warn(`Failed to upload ${storagePath}: ${uploadError.message}`);
          continue;
        }

        const url = getImageUrl(storagePath);

        // Create image record
        const { error: imgError } = await client
          .from('bh_product_images')
          .upsert(
            {
              product_id: product.id,
              filename,
              storage_path: storagePath,
              url,
              sort_order: j,
            },
            { onConflict: 'product_id,filename' }
          );

        if (imgError) {
          console.warn(`Failed to insert image record ${storagePath}: ${imgError.message}`);
        }
      }

      seededCount++;
    }

    return NextResponse.json({ success: true, count: seededCount });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
