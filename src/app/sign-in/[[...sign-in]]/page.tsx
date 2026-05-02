import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-forest px-4">
      <SignIn appearance={{ elements: { card: 'bg-deep-forest border border-white/10' } }} />
    </div>
  );
}
