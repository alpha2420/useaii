'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('❌ Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-50">
      <div className="max-w-md w-full bg-white border border-zinc-200 rounded-[2rem] p-12 text-center shadow-xl">
        <div className="w-20 h-20 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner font-bold text-4xl">
          !
        </div>
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight mb-4">Something went wrong</h1>
        <p className="text-zinc-500 font-medium mb-10 leading-relaxed">
          We encountered an unexpected error. Don&apos;t worry, our team has been notified.
        </p>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => reset()}
            className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
          >
            Try again
          </button>
          <Link
            href="/"
            className="w-full py-4 rounded-xl bg-white border border-zinc-200 text-zinc-900 font-bold text-lg hover:bg-zinc-50 transition"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
