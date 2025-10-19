"use client";

import Link from "next/link";
import { Scale } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm">
          <div className="flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-teal-600" />
            <span className="font-semibold text-slate-800">MIZAN</span>
          </div>
          <span className="text-slate-300">|</span>
          <Link
            href="/cgu"
            className="text-slate-600 hover:text-teal-600 transition-colors"
          >
            CGU
          </Link>
          <Link
            href="/privacy"
            className="text-slate-600 hover:text-teal-600 transition-colors"
          >
            Confidentialité
          </Link>
          <Link
            href="/legal"
            className="text-slate-600 hover:text-teal-600 transition-colors"
          >
            Légal
          </Link>
          <Link
            href="/contact"
            className="text-slate-600 hover:text-teal-600 transition-colors"
          >
            Contact
          </Link>
          <Link
            href="/feedback"
            className="text-slate-600 hover:text-teal-600 transition-colors"
          >
            Feedback
          </Link>
          <span className="text-slate-300">|</span>
          <span className="text-slate-400">© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
