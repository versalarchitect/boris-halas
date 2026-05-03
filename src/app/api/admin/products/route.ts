import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabase, STORAGE_BUCKET, getImageUrl } from "@/lib/supabase";
import { checkAdminAuth } from '../auth-check';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DbRow = Record<string, any>;

export async function GET(request: NextRequest) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  try {
    const { data: products, error: productsError } = await supabase
      .from('bh_products')
      .select('*')
      .order('sort_order', { ascending: true });

    if (productsError) {
      return NextResponse.json({ error: productsError.message }, { status: 500 });
    }

    const { data: images, error: imagesError } = await supabase
      .from('bh_product_images')
      .select('*')
      .order('sort_order', { ascending: true });

    if (imagesError) {
      return NextResponse.json({ error: imagesError.message }, { status: 500 });
    }

    const imagesByProduct = new Map<string, typeof images>();
    for (const img of images ?? []) {
      const list = imagesByProduct.get(img.product_id) ?? [];
      list.push(img);
      imagesByProduct.set(img.product_id, list);
    }

    const result = (products ?? []).map((p: DbRow) => ({
      id: p.id,
      title: p.title,
      category: p.category,
      productCode: p.product_code,
      status: p.status,
      price: Number(p.price),
      currency: p.currency,
      description: p.description,
      longDescription: p.long_description,
      specifications: p.specifications ?? [],
      features: p.features ?? [],
      tags: p.tags ?? [],
      weight: p.weight,
      dimensions: p.dimensions,
      materials: p.materials ?? [],
      careInstructions: p.care_instructions,
      sortOrder: p.sort_order,
      images: (imagesByProduct.get(p.id) ?? []).map((img: DbRow) => ({
        id: img.id,
        url: img.url,
        filename: img.filename,
        storagePath: img.storage_path,
        sortOrder: img.sort_order,
      })),
    }));

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  try {
    const client = supabase;
    const products = await request.json();

    if (!Array.isArray(products)) {
      return NextResponse.json({ error: 'Expected array of products' }, { status: 400 });
    }

    for (const product of products) {
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
          sort_order: product.sortOrder,
          updated_at: new Date().toISOString(),
        });

      if (productError) {
        return NextResponse.json({ error: productError.message }, { status: 500 });
      }

      // Update image sort orders if images are provided
      if (Array.isArray(product.images)) {
        for (const image of product.images) {
          if (image.id) {
            const { error: imgError } = await client
              .from('bh_product_images')
              .update({ sort_order: image.sortOrder })
              .eq('id', image.id);

            if (imgError) {
              return NextResponse.json({ error: imgError.message }, { status: 500 });
            }
          }
        }
      }
    }

    revalidatePath('/');
    for (const product of products) {
      revalidatePath(`/products/${product.id}`);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
