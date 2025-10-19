"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function ContactPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 via-white to-teal-100 pt-20">
      <div className="max-w-4xl mx-auto px-5 py-20">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-teal-600 transition-all mb-10 text-[0.95rem] cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Retour</span>
        </button>

        {/* Header */}
        <div className="border-b-[3px] border-teal-600 pb-10 mb-16">
          <h1 className="text-6xl font-light tracking-tight mb-5 text-slate-900">
            Contact
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl leading-relaxed">
            Pour toute question, notre équipe est à votre disposition.
            Choisissez le service adapté à votre demande.
          </p>
        </div>

        {/* Contact List */}
        <ul className="list-none mb-20">
          {/* Support Technique */}
          <li className="border-b border-slate-200 py-10 transition-all">
            <h2 className="text-3xl font-normal mb-3 text-slate-900">
              Support Technique
            </h2>
            <p className="text-slate-600 mb-5 text-lg leading-relaxed">
              Pour tous vos problèmes techniques, bugs ou questions sur
              l'utilisation de la plateforme.
            </p>

            <a
              href="mailto:support@mizan-dz.com?subject=Support technique"
              className="inline-block text-teal-600 text-xl font-mono relative pb-1 
                after:content-[''] after:absolute after:bottom-0 after:left-0 
                after:w-0 after:h-0.5 after:bg-teal-600 after:transition-all 
                hover:after:w-full"
            >
              support@mizan-dz.com
            </a>
            <span className="inline-block text-sm text-slate-400 italic ml-5">
              Réponse sous 24 heures
            </span>
          </li>

          {/* Contact Général */}
          <li className="border-b border-slate-200 py-10 transition-all">
            <h2 className="text-3xl font-normal mb-3 text-slate-900">
              Contact Général
            </h2>
            <p className="text-slate-600 mb-5 text-lg leading-relaxed">
              Questions générales, partenariats, presse, suggestions
              d'amélioration de la plateforme.
            </p>

            <a
              href="mailto:contact@mizan-dz.com?subject=Contact"
              className="inline-block text-teal-600 text-xl font-mono relative pb-1 
                after:content-[''] after:absolute after:bottom-0 after:left-0 
                after:w-0 after:h-0.5 after:bg-teal-600 after:transition-all 
                hover:after:w-full"
            >
              contact@mizan-dz.com
            </a>
            <span className="inline-block text-sm text-slate-400 italic ml-5">
              Réponse sous 48 heures
            </span>
          </li>

          {/* Support Avocats - Version discrète */}
          <li className="border-b border-slate-200 py-10 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-3xl font-normal text-slate-900">
                Support Avocats
              </h2>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-md border border-slate-200">
                Réservé aux avocats
              </span>
            </div>
            <p className="text-slate-600 mb-5 text-lg leading-relaxed">
              Service dédié exclusivement aux avocats pour la gestion de profil,
              réclamations et consultations.
            </p>

            <a
              href="mailto:avocat@mizan-dz.com?subject=Question avocat"
              className="inline-block text-teal-600 text-xl font-mono relative pb-1 
                after:content-[''] after:absolute after:bottom-0 after:left-0 
                after:w-0 after:h-0.5 after:bg-teal-600 after:transition-all 
                hover:after:w-full"
            >
              avocat@mizan-dz.com
            </a>
            <span className="inline-block text-sm text-slate-400 italic ml-5">
              Réponse prioritaire sous 12 heures
            </span>
          </li>
        </ul>

        <div>
          <h3 className="text-2xl font-normal mb-5 text-slate-900">
            Questions Fréquentes
          </h3>
          <p className="text-slate-600 mb-5 leading-relaxed">
            Avant de nous contacter, consultez notre FAQ. Vous y trouverez
            peut-être déjà la réponse à votre question.
          </p>
          <Link
            href="/faq"
            className="inline-block mt-5 px-6 py-3 border-2 border-teal-600 text-teal-600 
                hover:bg-teal-600 hover:text-white transition-all rounded-full"
          >
            Consulter la FAQ
          </Link>
        </div>
      </div>
    </div>
  );
}
