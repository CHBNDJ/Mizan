"use client";
import { Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function PrivacyPolicyPage() {
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
            <Shield className="w-8 h-8 text-teal-600" />
            <h1 className="text-3xl font-bold text-slate-900">
              Politique de Confidentialité
            </h1>
          </div>
          <p className="animate-section text-slate-600 mb-8">
            Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
          </p>

          <div className="prose prose-slate max-w-none space-y-8">
            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                1. Introduction
              </h2>
              <p className="text-slate-700 leading-relaxed">
                MIZAN s'engage à protéger la confidentialité et la sécurité de
                vos données personnelles. Cette politique explique comment nous
                collectons, utilisons et protégeons vos informations.
              </p>
              <p className="text-slate-700 leading-relaxed mt-3">
                MIZAN s'efforce de respecter la législation algérienne en
                matière de protection des données personnelles, notamment la loi
                n° 18-07 du 10 juin 2018 relative à la protection des personnes
                physiques dans le traitement des données à caractère personnel.
              </p>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                2. Données publiques des professionnels (source externe)
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-3">
                  📋 Collecte de données professionnelles publiques
                </h3>
                <p className="text-blue-800 leading-relaxed mb-3">
                  MIZAN collecte et publie des informations professionnelles
                  concernant des avocats, notaires, huissiers et comptables
                  exerçant en Algérie. Ces informations proviennent
                  exclusivement de{" "}
                  <strong>sources publiques et accessibles librement</strong>{" "}
                  sur internet, notamment :
                </p>
                <ul className="list-disc list-inside space-y-2 text-blue-800">
                  <li>
                    Sites web officiels des cabinets d'avocats et études
                    notariales
                  </li>
                  <li>
                    Pages professionnelles publiques (Google My Business,
                    LinkedIn, etc.)
                  </li>
                  <li>Annuaires professionnels publics en ligne</li>
                  <li>Réseaux sociaux professionnels publics</li>
                  <li>Publications professionnelles accessibles au public</li>
                </ul>
                <h3 className="font-semibold text-blue-900 mt-5 mb-3">
                  🔍 Nature des informations collectées
                </h3>
                <ul className="list-disc list-inside space-y-2 text-blue-800">
                  <li>Nom et prénom du professionnel</li>
                  <li>Adresse du cabinet ou de l'étude</li>
                  <li>Numéro de téléphone professionnel</li>
                  <li>Adresse email professionnelle</li>
                  <li>Domaines de compétence (si disponibles)</li>
                  <li>Langues parlées (si disponibles)</li>
                  <li>
                    Numéro professionnel (barreau, chambre des notaires,
                    huissier, ONEC/ONCA si disponible)
                  </li>
                </ul>
                <h3 className="font-semibold text-blue-900 mt-5 mb-3">
                  ✅ Utilisation et finalité
                </h3>
                <p className="text-blue-800 leading-relaxed">
                  Ces données sont utilisées uniquement dans le cadre d'un
                  service d'annuaire professionnel et de mise en relation entre
                  clients et professionnels. Elles ne font l'objet d'aucune
                  exploitation commerciale non autorisée.
                </p>
                <h3 className="font-semibold text-blue-900 mt-5 mb-3">
                  📧 Information des professionnels concernés
                </h3>
                <p className="text-blue-800 leading-relaxed">
                  MIZAN s'engage à informer chaque professionnel dont les
                  coordonnées sont publiées sur le site. Les professionnels sont
                  contactés par email ou téléphone pour les informer de la
                  présence de leurs informations sur la plateforme.
                </p>
                <div className="mt-4 p-4 bg-blue-100 border border-blue-300 rounded">
                  <p className="text-blue-900 font-semibold mb-2">
                    🛡️ Droits des professionnels concernant leurs données
                  </p>
                  <p className="text-blue-800 text-sm mb-2">
                    Tout professionnel figurant sur MIZAN dispose des droits
                    suivants, qu'il peut exercer à tout moment et gratuitement :
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
                    <li>
                      <strong>Droit de rectification :</strong> Corriger toute
                      information incorrecte ou obsolète
                    </li>
                    <li>
                      <strong>Droit de suppression :</strong> Demander le
                      retrait complet de son profil du site
                    </li>
                    <li>
                      <strong>Droit d'opposition :</strong> S'opposer à
                      l'utilisation de ses données pour la mise en relation
                    </li>
                    <li>
                      <strong>Droit d'accès :</strong> Consulter l'ensemble des
                      données publiées le concernant
                    </li>
                  </ul>
                  <p className="text-blue-800 text-sm mt-3">
                    <strong>Contact :</strong>{" "}
                    <a
                      href="mailto:professionnel@mizan-dz.com"
                      className="underline font-medium"
                    >
                      professionnel@mizan-dz.com
                    </a>{" "}
                    — Délai de traitement : 15 jours ouvrés maximum.
                  </p>
                </div>
                <p className="text-blue-800 leading-relaxed mt-4 text-sm">
                  <strong>Note importante :</strong> Les professionnels qui
                  créent un compte sur MIZAN et revendiquent leur profil
                  bénéficient d'un contrôle total sur leurs informations et
                  peuvent les modifier directement depuis leur espace personnel.
                </p>
              </div>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                3. Données collectées pour les utilisateurs inscrits
              </h2>
              <div className="space-y-3">
                <h3 className="font-semibold text-slate-800">
                  Pour tous les utilisateurs inscrits :
                </h3>
                <ul className="list-disc list-inside space-y-2 text-slate-700">
                  <li>Nom et prénom</li>
                  <li>Adresse email</li>
                  <li>Mot de passe (crypté)</li>
                  <li>Date de création du compte</li>
                </ul>
                <h3 className="font-semibold text-slate-800 mt-4">
                  Pour les clients :
                </h3>
                <ul className="list-disc list-inside space-y-2 text-slate-700">
                  <li>Localisation (wilaya ou pays)</li>
                  <li>Historique des consultations</li>
                  <li>Avis publiés</li>
                </ul>
                <h3 className="font-semibold text-slate-800 mt-4">
                  Pour les professionnels inscrits (avocats, notaires,
                  huissiers, comptables) :
                </h3>
                <ul className="list-disc list-inside space-y-2 text-slate-700">
                  <li>
                    Numéro professionnel (barreau / chambre des notaires /
                    huissier / ONEC-ONCA)
                  </li>
                  <li>Domaines d'intervention</li>
                  <li>
                    Coordonnées professionnelles (téléphone, adresse cabinet)
                  </li>
                  <li>Documents de vérification (carte professionnelle)</li>
                  <li>Informations bancaires (pour paiements futurs)</li>
                </ul>
              </div>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                4. Utilisation des données
              </h2>
              <p className="text-slate-700 leading-relaxed mb-3">
                Vos données sont utilisées uniquement pour :
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>Créer et gérer votre compte</li>
                <li>
                  Faciliter la mise en relation entre clients et professionnels
                </li>
                <li>
                  Envoyer des notifications importantes (réponses aux
                  consultations)
                </li>
                <li>
                  Vérifier l'identité et les qualifications des professionnels
                  inscrits
                </li>
                <li>Améliorer nos services</li>
                <li>Respecter nos obligations légales</li>
              </ul>
              <p className="text-slate-700 leading-relaxed mt-4 font-semibold">
                Nous ne vendons jamais vos données personnelles à des tiers.
              </p>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                5. Partage des données
              </h2>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>
                  <strong>Entre utilisateurs :</strong> Les clients voient les
                  informations publiques des profils professionnels. Les
                  professionnels voient le nom et email des clients qui les
                  contactent.
                </li>
                <li>
                  <strong>Prestataires techniques :</strong> Nous utilisons
                  Supabase pour l'hébergement sécurisé des données.
                </li>
                <li>
                  <strong>Obligations légales :</strong> En cas de demande
                  judiciaire ou administrative légale.
                </li>
              </ul>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                6. Sécurité des données
              </h2>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>Cryptage des mots de passe</li>
                <li>Connexion sécurisée HTTPS</li>
                <li>Hébergement sur serveurs sécurisés (Supabase)</li>
                <li>Accès limité aux données personnelles</li>
                <li>Sauvegardes régulières</li>
              </ul>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                7. Cookies
              </h2>
              <p className="text-slate-700 leading-relaxed">
                Le site MIZAN utilise des cookies essentiels pour son
                fonctionnement (authentification, préférences). Nous n'utilisons
                pas de cookies publicitaires ou de tracking tiers.
              </p>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                8. Vos droits (utilisateurs inscrits)
              </h2>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>
                  <strong>Droit d'accès :</strong> Consulter vos données
                  personnelles
                </li>
                <li>
                  <strong>Droit de rectification :</strong> Corriger vos
                  informations
                </li>
                <li>
                  <strong>Droit à l'effacement :</strong> Supprimer votre compte
                </li>
                <li>
                  <strong>Droit de portabilité :</strong> Récupérer vos données
                </li>
                <li>
                  <strong>Droit d'opposition :</strong> Refuser certaines
                  utilisations
                </li>
              </ul>
              <p className="text-slate-700 leading-relaxed mt-3">
                Pour exercer ces droits :{" "}
                <a
                  href="mailto:contact@mizan-dz.com"
                  className="text-teal-600 hover:underline font-medium"
                >
                  contact@mizan-dz.com
                </a>
              </p>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                9. Conservation des données
              </h2>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>
                  <strong>Comptes actifs :</strong> Données conservées tant que
                  le compte existe
                </li>
                <li>
                  <strong>Comptes supprimés :</strong> Données effacées sous 30
                  jours, sauf obligations légales
                </li>
                <li>
                  <strong>Avis publiés :</strong> Conservés de manière
                  anonymisée après suppression du compte
                </li>
                <li>
                  <strong>Données de professionnels non inscrits :</strong>{" "}
                  Conservées tant que le professionnel n'a pas demandé leur
                  suppression
                </li>
              </ul>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                10. Modifications
              </h2>
              <p className="text-slate-700 leading-relaxed">
                Nous pouvons modifier cette politique. Les modifications
                importantes vous seront notifiées par email.
              </p>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                11. Contact
              </h2>
              <a
                href="mailto:contact@mizan-dz.com?subject=Question sur la confidentialité"
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
