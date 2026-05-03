import { NextRequest, NextResponse } from 'next/server';
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

    // Fetch image record to get storage path
    const { data: image, error: fetchError } = await client
      .from('bh_product_images')
      .select('storage_path')
      .eq('id', id)
      .single();

    if (fetchError || !image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Delete from storage
    await client.storage
      .from(STORAGE_BUCKET)
      .remove([image.storage_path]);

    // Delete record
    const { error: deleteError } = await client
      .from('bh_product_images')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
