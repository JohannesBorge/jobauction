'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

export default function AuthErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const { resendConfirmationEmail } = useAuthStore();

  const handleResendEmail = async () => {
    const email = localStorage.getItem('pendingEmail');
    if (email) {
      await resendConfirmationEmail(email);
      router.push('/auth/verify-email');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {error === 'access_denied' ? 'Link Expired' : 'Authentication Error'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {errorDescription || 'An error occurred during authentication.'}
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="rounded-md bg-yellow-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  What to do next?
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    The link you used has expired or is invalid. You can:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Request a new confirmation email</li>
                    <li>Try signing up again</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <button
              onClick={handleResendEmail}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Resend Confirmation Email
            </button>

            <Link
              href="/register"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign Up Again
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 