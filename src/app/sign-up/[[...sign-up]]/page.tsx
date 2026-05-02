import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-forest px-4">
      <SignUp appearance={{ elements: { card: 'bg-deep-forest border border-white/10' } }} />
    </div>
  );
}
