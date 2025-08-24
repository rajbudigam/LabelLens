import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="space-y-6">
      <h1 className="text-3xl font-semibold">Page Not Found</h1>
      <p className="text-slate-400">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link 
        href="/"
        className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg"
      >
        Go Home
      </Link>
    </main>
  );
}
