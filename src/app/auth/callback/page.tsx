'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AuthCallbackPage() {
  const router = useRouter();
  const { checkSession } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          router.push('/login');
          return;
        }

        if (session) {
          // Update the auth store with the new session
          await checkSession();
          router.push('/dashboard');
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error in callback:', error);
        router.push('/login');
      }
    };

    handleCallback();
  }, [router, checkSession]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Verifying your email...</h2>
        <p className="mt-2 text-gray-600">Please wait while we complete the verification process.</p>
      </div>
    </div>
  );
} 