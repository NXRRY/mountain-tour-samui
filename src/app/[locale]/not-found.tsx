import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
      <div className="text-center">
        <div className="text-8xl font-bold text-orange-primary mb-4">404</div>
        <h1 className="text-2xl font-bold text-charcoal mb-2">Page Not Found</h1>
        <p className="text-stone/60 mb-8">The page you are looking for doesn't exist or has been moved.</p>
        <Link href="/en" className="bg-orange-primary hover:bg-orange-dark text-white px-8 py-3 rounded-full font-semibold transition-all">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
