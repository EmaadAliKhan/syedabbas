import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';
import { getInquiries, markRead } from '@/lib/kv';

async function requireSession() {
  const session = await getSessionFromCookies();
  if (!session) {
    return null;
  }
  return session;
}

export async function GET() {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const inquiries = await getInquiries();
    return NextResponse.json({ success: true, inquiries });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch inquiries';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const id = typeof body.id === 'string' ? body.id.trim() : '';

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Inquiry id is required' },
        { status: 400 }
      );
    }

    await markRead(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to mark inquiry as read';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
