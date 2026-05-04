import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabase, STORAGE_BUCKET } from '@/lib/supabase';
import { checkAdminAuth } from '../../auth-check';

export async function POST(request: NextRequest) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const category = formData.get('category') as string | null;
    const alt = (formData.get('alt') as string) || '';
    const widthStr = formData.get('width') as string | null;
    const heightStr = formData.get('height') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!category) {
      return NextResponse.json({ error: 'No category provided' }, { status: 400 });
    }

    const validCategories = ['around', 'fashion', 'editorial', 'music', 'somewhere'];
    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: `Invalid category. Must be one of: ${validCategories.join(', ')}` }, { status: 400 });
    }

    const width = widthStr ? parseInt(widthStr, 10) : 2000;
    const height = heightStr ? parseInt(heightStr, 10) : 3000;
    const filename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 200);
    const storagePath = `gallery/${category}/${filename}`;

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, file, { contentType: file.type, upsert: true });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(storagePath);

    // Determine next sort_order for this category
    const { data: existing, error: orderError } = await supabase
      .from('bh_gallery_images')
      .select('sort_order')
      .eq('category', category)
      .order('sort_order', { ascending: false })
      .limit(1);

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    const nextSortOrder = existing && existing.length > 0 ? existing[0].sort_order + 1 : 0;

    // Insert record
    const { data: record, error: insertError } = await supabase
      .from('bh_gallery_images')
      .insert({
        category,
        src: publicUrl,
        alt,
        width,
        height,
        sort_order: nextSortOrder,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    revalidatePath('/');

    return NextResponse.json(record);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
