'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

function CheckoutSuccessInner() {
  const params = useSearchParams();
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const sessionId = params.get('session_id');
  const [status, setStatus] = useState<'pending' | 'complete'>('pending');
  const [credits, setCredits] = useState<number | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    let active = true;
    const poll = async () => {
      const res = await fetch(`/api/checkout/status?session_id=${sessionId}`);
      const data = await res.json();
      if (!active) return;
      if (data.status === 'complete') {
        setStatus('complete');
        setCredits(data.credits);
        setEmail(data.email ?? null);
        if (isSignedIn) {
          setTimeout(() => router.push('/dashboard'), 1500);
        }
      } else {
        setTimeout(poll, 1000);
      }
    };
    poll();
    return () => { active = false; };
  }, [sessionId, isSignedIn, router]);

  if (!sessionId) return <div className="p-8">Missing session ID.</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-forest p-8">
      <div className="max-w-md text-center">
        {status === 'pending' ? (
          <>
            <h1 className="text-3xl font-bold text-cream">Processing your payment...</h1>
            <p className="mt-4 text-muted">This usually takes a few seconds.</p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-cream">Payment received!</h1>
            <p className="mt-4 text-muted">
              {credits?.toLocaleString()} credits added to{' '}
              {email ? <span className="text-cream font-medium">{email}</span> : 'your account'}.
            </p>
            {!isSignedIn && (
              <p className="mt-4 text-cream">
                Check your email for a sign-in link to access your dashboard.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-forest p-8">
          <div className="max-w-md text-center">
            <h1 className="text-3xl font-bold text-cream">Processing your payment...</h1>
          </div>
        </div>
      }
    >
      <CheckoutSuccessInner />
    </Suspense>
  );
}
