import { NextResponse } from 'next/server';
import {
  createSessionToken,
  setSessionCookie,
  verifyPassword,
} from '@/lib/auth';

export async function POST(request: Request) {
  try {
    if (!process.env.ADMIN_PASSWORD || !process.env.SESSION_SECRET) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Admin login is not configured. Set ADMIN_PASSWORD and SESSION_SECRET in your environment.',
        },
        { status: 503 },
      );
    }

    const body = await request.json();
    const password = typeof body.password === 'string' ? body.password : '';

    if (!password || !verifyPassword(password)) {
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      );
    }

    const token = createSessionToken();
    await setSessionCookie(token);

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Login failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
