import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-teal-50 border border-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0d9488"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
            <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
            <path d="M7 21h10" />
            <path d="M12 3v18" />
            <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
          </svg>
        </div>

        <p className="text-7xl font-bold text-teal-600 mb-2">404</p>
        <h1 className="text-2xl font-bold text-slate-800 mb-3">
          Page introuvable
        </h1>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-medium text-sm transition-colors"
          >
            Retour à l'accueil
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center justify-center gap-2 bg-white border border-teal-200 hover:bg-teal-50 text-teal-700 px-6 py-3 rounded-xl font-medium text-sm transition-colors"
          >
            Trouver un avocat
          </Link>
        </div>
      </div>
    </div>
  );
}
