'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-[120px] opacity-20 -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-100 rounded-full blur-[120px] opacity-20 -ml-20 -mb-20"></div>

      <div className="max-w-md w-full bg-white border border-zinc-200 rounded-[3rem] p-12 text-center shadow-2xl relative z-10">
        <h1 className="text-8xl font-black text-zinc-900 tracking-tighter mb-4 italic">404</h1>
        <h2 className="text-2xl font-bold text-zinc-800 mb-4 tracking-tight">Page Not Found</h2>
        <p className="text-zinc-500 font-medium mb-10 leading-relaxed text-sm">
          Oops! The page you're looking for doesn't exist or has been moved. Use the navigation to find your way back.
        </p>
        <Link
          href="/"
          className="inline-block w-full py-4 rounded-2xl bg-zinc-900 text-white font-bold text-lg hover:bg-zinc-800 transition shadow-xl"
        >
          Take Me Home
        </Link>
      </div>
    </div>
  );
}
