'use client';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100 rounded-full blur-[150px] opacity-20 -z-10 animate-pulse"></div>
      
      <div className="flex flex-col items-center gap-8 relative z-10">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-zinc-100 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-b-purple-400 rounded-full animate-spin-reverse opacity-50"></div>
        </div>
        
        <div className="text-center animate-pulse">
          <div className="text-xl font-bold text-zinc-900 tracking-tight mb-2">Use<span className='text-blue-600'>.ai</span></div>
          <p className="text-zinc-500 font-bold text-xs uppercase tracking-[0.2em] opacity-80">Loading your experience...</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        .animate-spin-reverse {
          animation: spin-reverse 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
}
