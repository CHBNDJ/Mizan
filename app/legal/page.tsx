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
            <div className="animate-section bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="text-amber-900 font-semibold mb-1">
                    Projet en phase de lancement
                  </p>
                  <p className="text-amber-800 text-sm">
                    MIZAN est actuellement exploité par Chabane Nadji en tant
                    que développeur indépendant. Une structure juridique
                    formelle (SARL/SPA) sera créée prochainement. Cette page
                    sera mise à jour avec les informations d'immatriculation
                    complètes.
                  </p>
                </div>
              </div>
            </div>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                1. Éditeur et exploitant du site
              </h2>
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                <p className="text-slate-700 leading-relaxed">
                  <strong className="text-slate-900">Nom du projet :</strong>{" "}
                  MIZAN
                </p>
                <p className="text-slate-700 leading-relaxed">
                  <strong className="text-slate-900">Exploitant :</strong>{" "}
                  Chabane Nadji
                </p>
                <p className="text-slate-700 leading-relaxed">
                  <strong className="text-slate-900">Statut actuel :</strong>{" "}
                  Développeur indépendant / Autoentrepreneur
                </p>
                <p className="text-slate-700 leading-relaxed">
                  <strong className="text-slate-900">Email de contact :</strong>{" "}
                  <span className="text-teal-600">contact@mizan-dz.com</span>
                </p>
                <p className="text-slate-700 leading-relaxed">
                  <strong className="text-slate-900">Email personnel :</strong>{" "}
                  <span className="text-teal-600">chabane.nadji@gmail.com</span>
                </p>
                <p className="text-slate-700 leading-relaxed">
                  <strong className="text-slate-900">Téléphone :</strong> +33 6
                  60 25 35 70
                </p>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-blue-800 text-xs">
                    📋 <strong>Immatriculation commerciale en cours :</strong>{" "}
                    Les informations légales complètes (forme juridique, RC,
                    NIF, capital social) seront publiées dès la création
                    officielle de la société.
                  </p>
                </div>
              </div>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                1.5. Nature du site et distinction avec le tableau officiel
              </h2>
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
                <p className="text-teal-900 leading-relaxed font-medium mb-3">
                  ⚖️ MIZAN est un annuaire en ligne et une plateforme de mise en
                  relation entre particuliers et avocats exerçant en Algérie.
                </p>
                <p className="text-teal-800 leading-relaxed">
                  <strong>Important :</strong> Ce site n'est pas le tableau
                  officiel de l'Ordre des avocats tel que prévu par la loi n°
                  13-07 du 29 juillet 2013 relative à l'exercice de la
                  profession d'avocat. MIZAN ne prétend pas remplacer ni
                  reproduire le tableau officiel tenu par l'Ordre des avocats
                  d'Algérie.
                </p>
                <p className="text-teal-800 leading-relaxed mt-2">
                  Les informations présentées sur ce site constituent un service
                  complémentaire d'annuaire professionnel et ne sauraient se
                  substituer aux documents et registres officiels de l'Ordre.
                </p>
              </div>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                2. Responsable de la publication
              </h2>
              <p className="text-slate-700 leading-relaxed">
                <strong>Chabane Nadji</strong>
                <br />
                Développeur et fondateur du projet MIZAN
                <br />
                Email :{" "}
                <span className="text-teal-600">chabane.nadji@gmail.com</span>
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
              <p className="text-slate-700 leading-relaxed mt-3">
                Les informations professionnelles des avocats (noms,
                coordonnées, spécialités) restent la propriété de ces derniers
                et sont publiées dans un but informatif d'annuaire professionnel
                uniquement.
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
