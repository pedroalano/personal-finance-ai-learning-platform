import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold text-gray-900">404 — Page not found</h1>
      <Link href="/" className="mt-6 text-indigo-600 hover:underline">
        Go back home
      </Link>
    </main>
  );
}
