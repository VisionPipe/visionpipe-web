import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendMagicLink(toEmail: string, signInUrl: string): Promise<void> {
  if (!resend) {
    console.warn('RESEND_API_KEY not set; magic link would have been sent to', toEmail);
    return;
  }
  await resend.emails.send({
    from: 'VisionPipe <hello@visionpipe.ai>',
    to: toEmail,
    subject: 'Your VisionPipe sign-in link',
    html: `<p>Thanks for your purchase! <a href="${signInUrl}">Click here to sign in</a> and view your credits.</p>`,
  });
}

export async function sendDisputeAlert(disputeId: string, amount: number): Promise<void> {
  if (!resend) return;
  await resend.emails.send({
    from: 'VisionPipe <hello@visionpipe.ai>',
    to: 'hello@visionpipe.ai',
    subject: `[VisionPipe] New dispute: ${disputeId}`,
    html: `<p>A new dispute was opened: <code>${disputeId}</code> for ${amount / 100} USD.</p>`,
  });
}

export async function sendWaitlistNotification(
  feature: string,
  email: string,
  source?: string,
): Promise<void> {
  if (!resend) {
    console.warn(
      `RESEND_API_KEY not set; waitlist signup would have been emailed: ${feature} ← ${email}`,
    );
    return;
  }
  await resend.emails.send({
    from: 'VisionPipe <hello@visionpipe.ai>',
    to: 'hello@visionpipe.ai',
    subject: `[VisionPipe] Waitlist signup: ${feature}`,
    html: `<p>New <strong>${feature}</strong> waitlist signup: <code>${email}</code>${source ? ` (from ${source})` : ''}.</p>`,
  });
}
