import Link from 'next/link'

// Global not-found page (fallback for unlocalized 404s)
export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F5F3] px-4">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-neutral-800 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-neutral-700 mb-2">Page not found</h2>
                <p className="text-neutral-500 mb-8">The page you're looking for doesn't exist.</p>
                <Link
                    href="/"
                    className="inline-flex items-center px-6 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                >
                    Back to home
                </Link>
            </div>
        </div>
    )
}
