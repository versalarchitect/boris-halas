import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabase, STORAGE_BUCKET } from "@/lib/supabase";
import { checkAdminAuth } from '../../auth-check';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const client = supabase;

    // Fetch images to delete from storage
    const { data: images } = await client
      .from('bh_product_images')
      .select('storage_path')
      .eq('product_id', id);

    // Delete storage files
    if (images && images.length > 0) {
      const paths = images.map((img: { storage_path: string }) => img.storage_path);
      await client.storage.from(STORAGE_BUCKET).remove(paths);
    }

    // Delete product (images cascade-delete via FK)
    const { error } = await client
      .from('bh_products')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath('/');
    revalidatePath(`/products/${id}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
