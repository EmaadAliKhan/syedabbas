import { NextResponse } from 'next/server';
import { addInquiry } from '@/lib/kv';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const nameRaw = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const source = body.source === 'quick' ? 'quick' : 'contact';
    const name =
      nameRaw || (source === 'quick' ? 'Quick inquiry' : '');

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, error: 'A valid email is required' },
        { status: 400 }
      );
    }

    const id = await addInquiry({
      name,
      email,
      company: typeof body.company === 'string' ? body.company.trim() : undefined,
      projectType:
        typeof body.projectType === 'string' ? body.projectType.trim() : undefined,
      budget: typeof body.budget === 'string' ? body.budget.trim() : undefined,
      dates: typeof body.dates === 'string' ? body.dates.trim() : undefined,
      message: typeof body.message === 'string' ? body.message.trim() : undefined,
      source,
    });

    return NextResponse.json({ success: true, id });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to submit inquiry';

    const status =
      process.env.NODE_ENV === 'development' && message.includes('KV')
        ? 503
        : 500;

    return NextResponse.json({ success: false, error: message }, { status });
  }
}
