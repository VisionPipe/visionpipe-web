import { NextResponse } from 'next/server';
import { db } from '@/db/client';
import { waitlist } from '@/db/schema';
import { sendWaitlistNotification } from '@/lib/email';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL = 254;
const MAX_FEATURE = 64;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { email, feature } =
    body && typeof body === 'object'
      ? (body as { email?: unknown; feature?: unknown })
      : { email: undefined, feature: undefined };

  if (typeof email !== 'string' || !EMAIL_REGEX.test(email) || email.length > MAX_EMAIL) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
  }
  if (typeof feature !== 'string' || feature.length === 0 || feature.length > MAX_FEATURE) {
    return NextResponse.json({ error: 'Feature name required' }, { status: 400 });
  }

  const trimmedEmail = email.trim().toLowerCase();
  const trimmedFeature = feature.trim();
  const userAgent = req.headers.get('user-agent') ?? null;
  const source = req.headers.get('referer') ?? null;

  try {
    const inserted = await db
      .insert(waitlist)
      .values({
        email: trimmedEmail,
        feature: trimmedFeature,
        source,
        userAgent,
      })
      .onConflictDoNothing({ target: [waitlist.email, waitlist.feature] })
      .returning({ id: waitlist.id });

    if (inserted.length > 0) {
      // Fire-and-forget; don't fail the response if email send fails.
      sendWaitlistNotification(trimmedFeature, trimmedEmail, source ?? undefined).catch(
        (err) => console.error('Waitlist notification email failed:', err),
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Waitlist insert failed:', err);
    return NextResponse.json({ error: 'Could not record signup' }, { status: 500 });
  }
}
