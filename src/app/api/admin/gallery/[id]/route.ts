import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase';
import { checkAdminAuth } from '../../auth-check';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;

    const { error } = await supabase
      .from('bh_gallery_images')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
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
