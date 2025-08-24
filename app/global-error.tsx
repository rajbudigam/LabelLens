'use client';

import Link from 'next/link';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="bg-slate-950 text-slate-100">
        <div className="max-w-4xl mx-auto px-4 py-5">
          <h2 className="text-2xl font-semibold mb-4">Something went wrong!</h2>
          <p className="text-slate-400 mb-4">
            There was an error loading the page. Please try again.
          </p>
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg"
            onClick={() => reset()}
          >
            Try again
          </button>
          <Link 
            href="/"
            className="ml-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700"
          >
            Go home
          </Link>
        </div>
      </body>
    </html>
  );
}
