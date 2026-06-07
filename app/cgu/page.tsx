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
    gsap.fromTo(
      containerRef.current.querySelectorAll(".animate-section"),
      { opacity: 0, y: 30 },
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
          className="animate-section inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-8 cursor-pointer"
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
                clients avec des experts juridiques et comptables vérifiés en
                Algérie : avocats, notaires, huissiers de justice et comptables.
                La plateforme facilite la recherche, la consultation et la
                communication entre les parties, sans se substituer aux
                professionnels dans l'exercice de leur profession.
              </p>
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-5">
                <h3 className="font-semibold text-teal-900 mb-2">
                  ⚖️ Distinction avec les registres officiels
                </h3>
                <p className="text-teal-800 leading-relaxed">
                  <strong>Important :</strong> MIZAN n'est pas le tableau
                  officiel de l'Ordre des avocats tel que prévu par la loi n°
                  13-07 du 29 juillet 2013. MIZAN ne prétend pas remplacer les
                  registres officiels des ordres professionnels algériens
                  (barreau, chambre des notaires, ordre des huissiers,
                  ONEC/ONCA).
                </p>
                <p className="text-teal-800 leading-relaxed mt-2">
                  Les informations publiées sur MIZAN constituent un service
                  complémentaire d'annuaire et ne sauraient avoir la même valeur
                  juridique que les registres officiels.
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
                  Pour les professionnels (avocats, notaires, huissiers,
                  comptables) :
                </h3>
                <ul className="list-disc list-inside space-y-2 text-slate-700">
                  <li>
                    Vous devez exercer légalement votre profession en Algérie
                  </li>
                  <li>
                    Vous devez fournir les documents prouvant votre qualité
                    professionnelle (numéro de barreau, chambre des notaires, N°
                    d'huissier ou agrément ONEC/ONCA)
                  </li>
                  <li>Votre profil sera vérifié avant activation</li>
                  <li>
                    Vous vous engagez à respecter la déontologie et les règles
                    de votre profession
                  </li>
                </ul>
              </div>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                4. Services proposés
              </h2>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>
                  Recherche de professionnels par domaine d'intervention et
                  wilaya
                </li>
                <li>Consultation des profils professionnels vérifiés</li>
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
                  Les coordonnées et informations des professionnels publiées
                  sur MIZAN proviennent de deux sources :
                </p>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-blue-900">
                      A. Professionnels inscrits sur la plateforme
                    </h4>
                    <p className="text-blue-800 text-sm">
                      Les professionnels qui créent un compte sur MIZAN
                      fournissent volontairement leurs informations et disposent
                      d'un contrôle total sur leur profil.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900">
                      B. Données provenant de sources publiques
                    </h4>
                    <p className="text-blue-800 text-sm mb-2">
                      Certaines informations proviennent de{" "}
                      <strong>
                        sources publiques et accessibles librement
                      </strong>{" "}
                      sur internet : sites web officiels de cabinets, Google My
                      Business, LinkedIn, annuaires professionnels publics.
                    </p>
                  </div>
                </div>
                <h3 className="font-semibold text-blue-900 mt-4 mb-2">
                  📧 Information des professionnels
                </h3>
                <p className="text-blue-800 text-sm">
                  MIZAN s'engage à informer chaque professionnel dont les
                  coordonnées sont publiées, par email ou téléphone.
                </p>
              </div>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                6. Droits des professionnels concernant leurs données
              </h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                <p className="text-green-800 leading-relaxed mb-4">
                  Tout professionnel figurant sur MIZAN dispose des droits
                  suivants, qu'il peut exercer à tout moment,{" "}
                  <strong>gratuitement et sans justification</strong> :
                </p>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-green-900">
                      ✏️ Droit de rectification
                    </h3>
                    <p className="text-green-800 text-sm">
                      Tout professionnel peut demander la correction de ses
                      informations si elles sont inexactes ou obsolètes.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900">
                      🗑️ Droit de suppression
                    </h3>
                    <p className="text-green-800 text-sm">
                      Tout professionnel peut demander le retrait immédiat et
                      complet de ses coordonnées du site, sans justification.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900">
                      🚫 Droit d'opposition
                    </h3>
                    <p className="text-green-800 text-sm">
                      Tout professionnel peut s'opposer à l'utilisation de ses
                      données pour la mise en relation.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900">
                      👁️ Droit d'accès
                    </h3>
                    <p className="text-green-800 text-sm">
                      Tout professionnel peut consulter l'ensemble des
                      informations publiées le concernant sur MIZAN.
                    </p>
                  </div>
                </div>
                <div className="mt-5 p-4 bg-green-100 border border-green-300 rounded">
                  <h3 className="font-semibold text-green-900 mb-2">
                    📞 Comment exercer ces droits ?
                  </h3>
                  <ul className="space-y-1 text-green-800 text-sm">
                    <li>
                      <strong>Email :</strong>{" "}
                      <a
                        href="mailto:professionnel@mizan-dz.com"
                        className="underline"
                      >
                        professionnel@mizan-dz.com
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
              </div>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                7. Exactitude et mise à jour
              </h2>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>La disponibilité des professionnels peut évoluer</li>
                <li>Les coordonnées professionnelles peuvent changer</li>
                <li>Les domaines d'intervention peuvent être mis à jour</li>
              </ul>
              <p className="text-slate-700 leading-relaxed mt-3">
                Les utilisateurs sont invités à vérifier directement auprès des
                professionnels concernés toute information critique avant
                d'engager une démarche juridique ou comptable.
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
                  <li>
                    Vérifier les qualifications et l'inscription officielle des
                    professionnels
                  </li>
                  <li>Maintenir la plateforme en bon état de fonctionnement</li>
                  <li>Protéger les données personnelles des utilisateurs</li>
                  <li>Modérer les avis publiés</li>
                  <li>
                    Traiter rapidement les demandes de rectification ou
                    suppression
                  </li>
                  <li>
                    Informer les professionnels de la publication de leurs
                    données
                  </li>
                </ul>
                <h3 className="font-semibold text-slate-800 mt-4">
                  MIZAN décline toute responsabilité concernant :
                </h3>
                <ul className="list-disc list-inside space-y-2 text-slate-700">
                  <li>
                    La qualité des services fournis par les professionnels
                  </li>
                  <li>
                    Les conseils juridiques, notariaux ou comptables donnés
                  </li>
                  <li>Les honoraires pratiqués</li>
                  <li>Les résultats des procédures entreprises</li>
                  <li>Les litiges entre clients et professionnels</li>
                </ul>
                <p className="text-slate-700 leading-relaxed mt-4 bg-amber-50 border border-amber-200 rounded p-3">
                  <strong>⚠️ Important :</strong> Le site agit uniquement comme
                  intermédiaire de mise en relation. MIZAN ne sélectionne pas,
                  ne recommande pas et n'évalue pas les professionnels. Chaque
                  utilisateur est responsable de son choix de professionnel.
                </p>
              </div>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                9. Utilisation du site
              </h2>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>
                  Utiliser le site de manière loyale et conforme à son objet
                </li>
                <li>
                  Ne pas tenter d'extraire massivement les données du site
                  (scraping)
                </li>
                <li>
                  Ne pas utiliser les coordonnées des professionnels à des fins
                  de spam ou de harcèlement
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
                Pour d'autres demandes :{" "}
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
