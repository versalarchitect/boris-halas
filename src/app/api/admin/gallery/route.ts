import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase';
import { checkAdminAuth } from '../auth-check';

export async function GET(request: NextRequest) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  try {
    const category = request.nextUrl.searchParams.get('category');

    let query = supabase
      .from('bh_gallery_images')
      .select('*')
      .order('sort_order', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
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
    const items = await request.json();

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Expected array of {id, sort_order} objects' }, { status: 400 });
    }

    for (const item of items) {
      const { error } = await supabase
        .from('bh_gallery_images')
        .update({ sort_order: item.sort_order })
        .eq('id', item.id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    revalidatePath('/');

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
