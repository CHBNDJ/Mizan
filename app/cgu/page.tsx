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
                1. Objet et nature du site
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                MIZAN est une plateforme en ligne qui met en relation des
                clients à la recherche de services juridiques avec des avocats
                inscrits au barreau en Algérie. La plateforme facilite la
                recherche, la consultation et la communication entre les
                parties, sans se substituer aux avocats dans l'exercice de leur
                profession.
              </p>

              <div className="bg-teal-50 border border-teal-200 rounded-lg p-5">
                <h3 className="font-semibold text-teal-900 mb-2">
                  ⚖️ Distinction avec le tableau officiel
                </h3>
                <p className="text-teal-800 leading-relaxed">
                  <strong>Important :</strong> MIZAN n'est pas le tableau
                  officiel de l'Ordre des avocats tel que prévu par la loi n°
                  13-07 du 29 juillet 2013 relative à l'exercice de la
                  profession d'avocat. Ce site constitue un annuaire
                  professionnel et une plateforme de mise en relation
                  indépendante. MIZAN ne prétend pas remplacer, reproduire ou se
                  substituer au tableau officiel tenu par l'Ordre des avocats
                  d'Algérie.
                </p>
                <p className="text-teal-800 leading-relaxed mt-2">
                  Les informations publiées sur MIZAN constituent un service
                  complémentaire d'annuaire et ne sauraient avoir la même valeur
                  juridique que le tableau officiel.
                </p>
              </div>
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
                5. Nature et origine des informations publiées
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                <h3 className="font-semibold text-blue-900 mb-3">
                  📋 Collecte de données professionnelles publiques
                </h3>
                <p className="text-blue-800 leading-relaxed mb-3">
                  Les coordonnées et informations des avocats publiées sur MIZAN
                  proviennent de deux sources :
                </p>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-blue-900">
                      A. Avocats inscrits sur la plateforme
                    </h4>
                    <p className="text-blue-800 text-sm leading-relaxed">
                      Les avocats qui créent un compte sur MIZAN fournissent
                      volontairement leurs informations et disposent d'un
                      contrôle total sur leur profil.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-blue-900">
                      B. Données provenant de sources publiques
                    </h4>
                    <p className="text-blue-800 text-sm leading-relaxed mb-2">
                      Certaines informations d'avocats proviennent de{" "}
                      <strong>
                        sources publiques et accessibles librement
                      </strong>{" "}
                      sur internet, notamment :
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm ml-4">
                      <li>Sites web officiels des cabinets d'avocats</li>
                      <li>
                        Pages professionnelles publiques (Google My Business,
                        réseaux sociaux professionnels)
                      </li>
                      <li>Annuaires professionnels publics en ligne</li>
                      <li>
                        Publications professionnelles accessibles au public
                      </li>
                    </ul>
                  </div>
                </div>

                <p className="text-blue-800 leading-relaxed mt-4 text-sm">
                  <strong>Important :</strong> Ces informations sont utilisées
                  uniquement dans le cadre d'un service d'annuaire professionnel
                  et de mise en relation. Elles ne font l'objet d'aucune
                  exploitation commerciale non autorisée.
                </p>

                <h3 className="font-semibold text-blue-900 mt-4 mb-2">
                  📧 Information des avocats
                </h3>
                <p className="text-blue-800 text-sm leading-relaxed">
                  MIZAN s'engage à informer chaque avocat dont les coordonnées
                  sont publiées. Les avocats sont contactés par email ou
                  téléphone pour les informer de la présence de leurs
                  informations sur la plateforme et de leurs droits.
                </p>
              </div>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                6. Droits des avocats concernant leurs données
              </h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                <p className="text-green-800 leading-relaxed mb-4">
                  Tout avocat figurant sur MIZAN dispose des droits suivants,
                  qu'il peut exercer à tout moment,{" "}
                  <strong>gratuitement et sans justification</strong> :
                </p>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-green-900">
                      ✏️ Droit de rectification
                    </h3>
                    <p className="text-green-800 text-sm">
                      Tout avocat peut demander la correction de ses
                      informations si elles sont inexactes, incomplètes ou
                      obsolètes (adresse incorrecte, numéro de téléphone erroné,
                      spécialisation non à jour, etc.).
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-green-900">
                      🗑️ Droit de suppression
                    </h3>
                    <p className="text-green-800 text-sm">
                      Tout avocat peut demander le retrait immédiat et complet
                      de ses coordonnées du site, sans avoir à justifier sa
                      demande.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-green-900">
                      🚫 Droit d'opposition
                    </h3>
                    <p className="text-green-800 text-sm">
                      Tout avocat peut s'opposer à l'utilisation de ses données
                      pour la mise en relation, même si ces données sont
                      publiquement accessibles.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-green-900">
                      👁️ Droit d'accès
                    </h3>
                    <p className="text-green-800 text-sm">
                      Tout avocat peut demander à consulter l'ensemble des
                      informations publiées le concernant sur MIZAN.
                    </p>
                  </div>
                </div>

                <div className="mt-5 p-4 bg-green-100 border border-green-300 rounded">
                  <h3 className="font-semibold text-green-900 mb-2">
                    📞 Comment exercer ces droits ?
                  </h3>
                  <p className="text-green-800 text-sm mb-2">
                    Pour toute demande concernant vos données :
                  </p>
                  <ul className="space-y-1 text-green-800 text-sm">
                    <li>
                      <strong>Email :</strong>{" "}
                      <a
                        href="mailto:contact@mizan-dz.com"
                        className="underline"
                      >
                        contact@mizan-dz.com
                      </a>
                    </li>
                    <li>
                      <strong>Téléphone :</strong> +33 6 60 25 35 70
                    </li>
                    <li>
                      <strong>Délai de traitement :</strong> Maximum 15 jours
                      ouvrés
                    </li>
                  </ul>
                </div>

                <p className="text-green-800 text-sm mt-4">
                  <strong>💡 Conseil :</strong> Les avocats qui créent un compte
                  sur MIZAN bénéficient d'un contrôle direct et immédiat sur
                  leurs informations via leur espace personnel.
                </p>
              </div>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                7. Exactitude et mise à jour des informations
              </h2>
              <p className="text-slate-700 leading-relaxed mb-3">
                MIZAN met en œuvre tous les moyens nécessaires pour vérifier et
                maintenir l'exactitude des informations publiées. Toutefois, les
                utilisateurs reconnaissent que :
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>La disponibilité des avocats peut évoluer</li>
                <li>Les coordonnées professionnelles peuvent changer</li>
                <li>Les spécialisations peuvent être mises à jour</li>
              </ul>
              <p className="text-slate-700 leading-relaxed mt-3">
                Les utilisateurs sont invités à vérifier directement auprès des
                avocats concernés toute information critique avant d'engager une
                démarche juridique.
              </p>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                8. Responsabilités
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
                  <li>
                    Traiter rapidement les demandes de rectification ou
                    suppression
                  </li>
                  <li>
                    Informer les avocats de la publication de leurs données
                  </li>
                </ul>

                <h3 className="font-semibold text-slate-800 mt-4">
                  MIZAN décline toute responsabilité concernant :
                </h3>
                <ul className="list-disc list-inside space-y-2 text-slate-700">
                  <li>La qualité des services fournis par les avocats</li>
                  <li>Les conseils juridiques donnés par les avocats</li>
                  <li>Les honoraires pratiqués par les avocats</li>
                  <li>Les résultats des procédures juridiques entreprises</li>
                  <li>Les litiges entre clients et avocats</li>
                  <li>
                    Les pertes financières liées à l'utilisation de la
                    plateforme
                  </li>
                  <li>
                    Les erreurs dans les informations collectées depuis des
                    sources publiques
                  </li>
                </ul>

                <p className="text-slate-700 leading-relaxed mt-4 bg-amber-50 border border-amber-200 rounded p-3">
                  <strong>⚠️ Important :</strong> Le site agit uniquement comme
                  intermédiaire de mise en relation. MIZAN ne sélectionne pas,
                  ne recommande pas et n'évalue pas les avocats. Chaque
                  utilisateur est responsable de son choix d'avocat.
                </p>
              </div>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                9. Utilisation du site
              </h2>
              <p className="text-slate-700 leading-relaxed mb-3">
                Les utilisateurs s'engagent à :
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>
                  Utiliser le site de manière loyale et conforme à son objet
                </li>
                <li>
                  Ne pas tenter d'extraire massivement les données du site
                  (scraping)
                </li>
                <li>
                  Ne pas utiliser les coordonnées des avocats à des fins de spam
                  ou de harcèlement
                </li>
                <li>Respecter la propriété intellectuelle du site</li>
                <li>Ne pas publier de faux avis ou d'avis diffamatoires</li>
              </ul>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                10. Propriété intellectuelle
              </h2>
              <p className="text-slate-700 leading-relaxed">
                L'ensemble des éléments de la plateforme (logo, design, contenu
                éditorial) sont la propriété exclusive de MIZAN. Toute
                reproduction, même partielle, est strictement interdite sans
                autorisation préalable.
              </p>
              <p className="text-slate-700 leading-relaxed mt-3">
                Les informations professionnelles des avocats (noms,
                coordonnées, spécialités) restent la propriété de ces derniers
                et sont publiées dans un but informatif uniquement.
              </p>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                11. Modification et résiliation
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
                12. Droit applicable et juridiction
              </h2>
              <p className="text-slate-700 leading-relaxed">
                Les présentes conditions sont régies par le droit algérien. En
                cas de litige, les tribunaux algériens seront seuls compétents.
              </p>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                13. Contact
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
              <p className="text-slate-700 leading-relaxed mt-2">
                Téléphone : +33 6 60 25 35 70
              </p>
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
