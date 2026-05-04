import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase';
import { checkAdminAuth } from '../../auth-check';
import sharp from 'sharp';
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';

export async function POST(request: NextRequest) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const category = formData.get('category') as string | null;
    const alt = (formData.get('alt') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!category) {
      return NextResponse.json({ error: 'No category provided' }, { status: 400 });
    }

    // Read file buffer and get dimensions
    const buffer = Buffer.from(await file.arrayBuffer());
    const metadata = await sharp(buffer).metadata();
    const width = metadata.width ?? 0;
    const height = metadata.height ?? 0;

    // Save file to /public/{category}/
    const filename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const dir = path.join(process.cwd(), 'public', category);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), buffer);

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
        src: `/${category}/${filename}`,
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
