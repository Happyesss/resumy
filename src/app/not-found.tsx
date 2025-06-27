export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <h2 className="text-2xl mb-2">Page Not Found</h2>
      <p className="text-lg text-gray-400 mb-8">Sorry, the page you are looking for does not exist.</p>
      <a href="/" className="px-6 py-2 rounded bg-purple-600 hover:bg-purple-700 transition text-white font-semibold">Go Home</a>
    </div>
  );
}
