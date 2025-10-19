"use client";

import { Mail } from "lucide-react";
import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
      <div className="max-w-md mx-auto px-4 py-24">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-teal-600" />
          </div>

          <h1 className="text-2xl font-bold text-slate-800 mb-4">
            Vérifiez votre email
          </h1>

          <p className="text-slate-600 mb-6">
            Nous avons envoyé un email de confirmation à votre adresse. Cliquez
            sur le lien dans l'email pour activer votre compte.
          </p>

          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6">
            <p className="text-teal-800 text-sm">
              <strong>Vous ne voyez pas l'email ?</strong>
              <br />
              Vérifiez vos spams ou courrier indésirable.
            </p>
          </div>

          <Link
            href="/auth/client/login"
            className="text-teal-600 hover:text-teal-700 text-sm font-medium"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}
