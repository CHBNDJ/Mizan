"use client";

import { Scale, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function CGUPage() {
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
            <Scale className="w-8 h-8 text-teal-600" />
            <h1 className="text-3xl font-bold text-slate-900">
              Conditions Générales d'Utilisation
            </h1>
          </div>

          <p className="animate-section text-slate-600 mb-8">
            Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
          </p>

          <div className="prose prose-slate max-w-none space-y-8">
            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                1. Objet
              </h2>
              <p className="text-slate-700 leading-relaxed">
                MIZAN est une plateforme en ligne qui met en relation des
                clients à la recherche de services juridiques avec des avocats
                inscrits au barreau en Algérie. La plateforme facilite la
                recherche, la consultation et la communication entre les
                parties, sans se substituer aux avocats dans l'exercice de leur
                profession.
              </p>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                2. Acceptation des conditions
              </h2>
              <p className="text-slate-700 leading-relaxed">
                L'utilisation de MIZAN implique l'acceptation pleine et entière
                des présentes conditions générales. Si vous n'acceptez pas ces
                conditions, veuillez ne pas utiliser la plateforme.
              </p>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                3. Inscription et compte utilisateur
              </h2>
              <div className="space-y-3">
                <h3 className="font-semibold text-slate-800">
                  Pour les clients :
                </h3>
                <ul className="list-disc list-inside space-y-2 text-slate-700">
                  <li>L'inscription est gratuite et libre</li>
                  <li>Vous devez fournir des informations exactes et à jour</li>
                  <li>
                    Vous êtes responsable de la confidentialité de votre mot de
                    passe
                  </li>
                </ul>

                <h3 className="font-semibold text-slate-800 mt-4">
                  Pour les avocats :
                </h3>
                <ul className="list-disc list-inside space-y-2 text-slate-700">
                  <li>Vous devez être inscrit à un barreau en Algérie</li>
                  <li>
                    Vous devez fournir des documents prouvant votre inscription
                  </li>
                  <li>Votre profil sera vérifié avant activation</li>
                  <li>
                    Vous vous engagez à respecter la déontologie de votre
                    profession
                  </li>
                </ul>
              </div>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                4. Services proposés
              </h2>
              <p className="text-slate-700 leading-relaxed mb-3">
                MIZAN propose les services suivants :
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>Recherche d'avocats par spécialité et localisation</li>
                <li>Consultation des profils professionnels des avocats</li>
                <li>Envoi de demandes de consultation</li>
                <li>Système de messagerie sécurisée</li>
                <li>Publication d'avis clients (soumis à modération)</li>
              </ul>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                5. Responsabilités
              </h2>
              <div className="space-y-3">
                <h3 className="font-semibold text-slate-800">
                  MIZAN s'engage à :
                </h3>
                <ul className="list-disc list-inside space-y-2 text-slate-700">
                  <li>Vérifier l'inscription des avocats au barreau</li>
                  <li>Maintenir la plateforme en bon état de fonctionnement</li>
                  <li>Protéger les données personnelles des utilisateurs</li>
                  <li>Modérer les avis publiés</li>
                </ul>

                <h3 className="font-semibold text-slate-800 mt-4">
                  MIZAN décline toute responsabilité concernant :
                </h3>
                <ul className="list-disc list-inside space-y-2 text-slate-700">
                  <li>La qualité des services fournis par les avocats</li>
                  <li>Les conseils juridiques donnés par les avocats</li>
                  <li>Les litiges entre clients et avocats</li>
                  <li>
                    Les pertes financières liées à l'utilisation de la
                    plateforme
                  </li>
                </ul>
              </div>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                6. Propriété intellectuelle
              </h2>
              <p className="text-slate-700 leading-relaxed">
                L'ensemble des éléments de la plateforme (logo, design, contenu)
                sont la propriété exclusive de MIZAN. Toute reproduction, même
                partielle, est strictement interdite sans autorisation
                préalable.
              </p>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                7. Modification et résiliation
              </h2>
              <p className="text-slate-700 leading-relaxed">
                MIZAN se réserve le droit de modifier les présentes conditions à
                tout moment. Les utilisateurs seront informés par email des
                modifications importantes. Vous pouvez supprimer votre compte à
                tout moment depuis les paramètres.
              </p>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                8. Droit applicable et juridiction
              </h2>
              <p className="text-slate-700 leading-relaxed">
                Les présentes conditions sont régies par le droit algérien. En
                cas de litige, les tribunaux algériens seront seuls compétents.
              </p>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                9. Contact
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Pour toute question concernant ces conditions :
              </p>

              <a
                href="mailto:contact@mizan-dz.com?subject=Question sur les CGU"
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
        </div>
      </div>
    </div>
  );
}
