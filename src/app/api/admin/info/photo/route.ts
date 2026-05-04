import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { checkAdminAuth } from '../../auth-check';

export async function POST(request: NextRequest) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'file is required' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const destPath = path.join(process.cwd(), 'public', 'boris.jpg');

    await writeFile(destPath, buffer);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
