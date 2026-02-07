'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  const isStaleDeployment =
    error.message?.includes('Server Action') ||
    error.message?.includes('older or newer deployment')

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      {isStaleDeployment ? (
        <>
          <p className="text-gray-400 mb-6 text-center max-w-md">
            A new version of Resumy has been deployed. Please reload the page to
            get the latest version.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 rounded bg-purple-600 hover:bg-purple-700 transition text-white font-semibold"
          >
            Reload Page
          </button>
        </>
      ) : (
        <>
          <p className="text-gray-400 mb-6 text-center max-w-md">
            Sorry, something unexpected happened. Please try again.
          </p>
          <div className="flex gap-3">
            <button
              onClick={reset}
              className="px-6 py-2 rounded bg-purple-600 hover:bg-purple-700 transition text-white font-semibold"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 rounded border border-white/20 hover:bg-white/10 transition text-white font-semibold"
            >
              Reload Page
            </button>
          </div>
        </>
      )}
    </div>
  )
}