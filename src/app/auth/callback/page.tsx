'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      const email = localStorage.getItem('pendingEmail');
      if (email) {
        localStorage.removeItem('pendingEmail');
        await signIn(email, 'temporary-password');
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    };

    handleCallback();
  }, [router, signIn]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Verifying your email...</h2>
        <p className="mt-2 text-gray-600">Please wait while we complete the verification process.</p>
      </div>
    </div>
  );
} 