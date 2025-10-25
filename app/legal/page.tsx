"use client";

import { FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function LegalMentionsPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const sections = containerRef.current.querySelectorAll(".animate-section");

    gsap.fromTo(
      sections,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.2,
      }
    );
  }, []);

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
      <div className="max-w-4xl mx-auto px-4 py-12" ref={containerRef}>
        <button
          onClick={() => router.back()}
          className="animate-section inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-8 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12">
          <div className="animate-section flex items-center gap-3 mb-6">
            <FileText className="w-8 h-8 text-teal-600" />
            <h1 className="text-3xl font-bold text-slate-900">
              Mentions Légales
            </h1>
          </div>

          <p className="animate-section text-slate-600 mb-8">
            Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
          </p>

          <div className="prose prose-slate max-w-none space-y-8">
            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                1. Éditeur du site
              </h2>
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                <p className="text-slate-700 leading-relaxed">
                  <strong className="text-slate-900">Raison sociale :</strong>{" "}
                  MIZAN
                </p>
                <p className="text-slate-700 leading-relaxed">
                  <strong className="text-slate-900">Forme juridique :</strong>{" "}
                  [À compléter - SARL/SPA]
                </p>
                <p className="text-slate-700 leading-relaxed">
                  <strong className="text-slate-900">Capital social :</strong>{" "}
                  [À compléter]
                </p>
                <p className="text-slate-700 leading-relaxed">
                  <strong className="text-slate-900">Siège social :</strong>{" "}
                  [Votre adresse]
                </p>
                <p className="text-slate-700 leading-relaxed">
                  <strong className="text-slate-900">
                    Registre du commerce :
                  </strong>{" "}
                  [N° RC à compléter]
                </p>
                <p className="text-slate-700 leading-relaxed">
                  <strong className="text-slate-900">NIF :</strong> [Numéro à
                  compléter]
                </p>
                <p className="text-slate-700 leading-relaxed">
                  <strong className="text-slate-900">Email :</strong>{" "}
                  <span className="text-teal-600">contact@mizan-dz.com</span>
                </p>
                <p className="text-slate-700 leading-relaxed">
                  <strong className="text-slate-900">Téléphone :</strong> [À
                  compléter]
                </p>
              </div>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                2. Directeur de la publication
              </h2>
              <p className="text-slate-700 leading-relaxed">
                [Votre nom et prénom]
                <br />
                En qualité de [Gérant/Directeur]
              </p>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                3. Hébergement
              </h2>
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                <p className="text-slate-700 leading-relaxed">
                  <strong className="text-slate-900">Hébergeur :</strong>{" "}
                  Supabase Inc.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  <strong className="text-slate-900">Adresse :</strong> 970 Toa
                  Payoh North, #07-04, Singapore 318992
                </p>
                <p className="text-slate-700 leading-relaxed">
                  <strong className="text-slate-900">Site web :</strong>{" "}
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 hover:underline"
                  >
                    supabase.com
                  </a>
                </p>
              </div>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                4. Propriété intellectuelle
              </h2>
              <p className="text-slate-700 leading-relaxed">
                L'ensemble de ce site relève de la législation algérienne et
                internationale sur le droit d'auteur et la propriété
                intellectuelle. Tous les droits de reproduction sont réservés, y
                compris pour les documents téléchargeables et les
                représentations iconographiques et photographiques.
              </p>
              <p className="text-slate-700 leading-relaxed mt-3">
                La reproduction de tout ou partie de ce site sur un support
                électronique quel qu'il soit est formellement interdite sauf
                autorisation expresse de MIZAN.
              </p>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                5. Données personnelles
              </h2>
              <p className="text-slate-700 leading-relaxed">
                Les informations recueillies sur ce site font l'objet d'un
                traitement informatique destiné à faciliter la mise en relation
                entre clients et avocats. Pour plus d'informations, consultez
                notre{" "}
                <Link
                  href="/privacy"
                  className="text-teal-600 hover:underline font-medium"
                >
                  Politique de Confidentialité
                </Link>
                .
              </p>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                6. Cookies
              </h2>
              <p className="text-slate-700 leading-relaxed">
                Le site MIZAN utilise des cookies essentiels pour son
                fonctionnement (authentification, préférences). En naviguant sur
                ce site, vous acceptez l'utilisation de ces cookies techniques
                nécessaires.
              </p>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                7. Limitation de responsabilité
              </h2>
              <p className="text-slate-700 leading-relaxed">
                MIZAN met tout en œuvre pour offrir aux utilisateurs des
                informations et/ou outils disponibles et vérifiés, mais ne
                saurait être tenue pour responsable des erreurs, d'une absence
                de disponibilité des informations et/ou de la présence de virus
                sur son site.
              </p>
              <p className="text-slate-700 leading-relaxed mt-3">
                MIZAN ne saurait être tenue responsable de la qualité des
                services fournis par les avocats inscrits sur la plateforme.
              </p>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                8. Droit applicable
              </h2>
              <p className="text-slate-700 leading-relaxed">
                Les présentes mentions légales sont régies par le droit
                algérien. Tout litige relatif à l'utilisation du site MIZAN est
                soumis au droit algérien et relève de la compétence exclusive
                des tribunaux algériens.
              </p>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                9. Contact
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Pour toute question concernant les mentions légales :
              </p>

              <a
                href="mailto:contact@mizan-dz.com?subject=Question sur les mentions légales"
                className="text-teal-600 font-medium hover:underline text-lg"
              >
                contact@mizan-dz.com
              </a>
              <p className="text-slate-600 mt-4">
                Pour d'autres demandes, consultez notre{" "}
                <Link
                  href="/contact"
                  className="text-teal-600 hover:underline font-medium"
                >
                  page de contact
                </Link>
                .
              </p>
            </section>
          </div>

          <div className="animate-section mt-12 pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-500 text-center">
              MIZAN - Plateforme de mise en relation avec des avocats en Algérie
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
