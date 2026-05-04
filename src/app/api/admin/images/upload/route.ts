import { NextRequest, NextResponse } from 'next/server';
import { supabase, STORAGE_BUCKET, getImageUrl } from "@/lib/supabase";
import { checkAdminAuth } from '../../auth-check';

export async function POST(request: NextRequest) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const productId = formData.get('productId') as string | null;

    if (!file || !productId) {
      return NextResponse.json(
        { error: 'file and productId are required' },
        { status: 400 }
      );
    }

    const client = supabase;
    const sanitized = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 200);
    const storagePath = `${productId}/${sanitized}`;

    // Upload to storage
    const { error: uploadError } = await client.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, file, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Determine next sort_order
    const { data: existingImages } = await client
      .from('bh_product_images')
      .select('sort_order')
      .eq('product_id', productId)
      .order('sort_order', { ascending: false })
      .limit(1);

    const nextSortOrder = existingImages && existingImages.length > 0
      ? existingImages[0].sort_order + 1
      : 0;

    const url = getImageUrl(storagePath);

    // Create or update image record
    const { data: imageRecord, error: insertError } = await client
      .from('bh_product_images')
      .upsert({
        product_id: productId,
        filename: sanitized,
        storage_path: storagePath,
        url,
        sort_order: nextSortOrder,
      }, { onConflict: 'product_id,filename' })
      .select()
      .single();

    if (insertError) {
      const msg = insertError.message.includes('foreign key')
        ? `Product "${productId}" does not exist`
        : insertError.message;
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    return NextResponse.json({
      id: imageRecord.id,
      url: imageRecord.url,
      filename: imageRecord.filename,
      storagePath: imageRecord.storage_path,
      sortOrder: imageRecord.sort_order,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
