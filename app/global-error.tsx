'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">Error</h1>
            <p className="text-xl text-gray-600 mb-8">
              {error.message || 'Something went wrong'}
            </p>
            <button
              onClick={reset}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
