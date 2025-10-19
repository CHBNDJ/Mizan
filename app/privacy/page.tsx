"use client";

import { Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PrivacyPolicyPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-8 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-teal-600" />
            <h1 className="text-3xl font-bold text-slate-900">
              Politique de Confidentialité
            </h1>
          </div>

          <p className="text-slate-600 mb-8">
            Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
          </p>

          <div className="prose prose-slate max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                1. Introduction
              </h2>
              <p className="text-slate-700 leading-relaxed">
                MIZAN s'engage à protéger la confidentialité et la sécurité de
                vos données personnelles. Cette politique explique comment nous
                collectons, utilisons et protégeons vos informations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                2. Données collectées
              </h2>
              <div className="space-y-3">
                <h3 className="font-semibold text-slate-800">
                  Pour tous les utilisateurs :
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
                  <li>Localisation (wilaya)</li>
                  <li>Historique des consultations</li>
                  <li>Avis publiés</li>
                </ul>

                <h3 className="font-semibold text-slate-800 mt-4">
                  Pour les avocats :
                </h3>
                <ul className="list-disc list-inside space-y-2 text-slate-700">
                  <li>Numéro d'inscription au barreau</li>
                  <li>Spécialités juridiques</li>
                  <li>
                    Coordonnées professionnelles (téléphone, adresse cabinet)
                  </li>
                  <li>Documents de vérification (carte professionnelle)</li>
                  <li>Informations bancaires (pour paiements futurs)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                3. Utilisation des données
              </h2>
              <p className="text-slate-700 leading-relaxed mb-3">
                Vos données sont utilisées uniquement pour :
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>Créer et gérer votre compte</li>
                <li>Faciliter la mise en relation entre clients et avocats</li>
                <li>
                  Envoyer des notifications importantes (réponses aux
                  consultations)
                </li>
                <li>Vérifier l'identité et les qualifications des avocats</li>
                <li>Améliorer nos services</li>
                <li>Respecter nos obligations légales</li>
              </ul>
              <p className="text-slate-700 leading-relaxed mt-4 font-semibold">
                Nous ne vendons jamais vos données personnelles à des tiers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                4. Partage des données
              </h2>
              <p className="text-slate-700 leading-relaxed mb-3">
                Vos données peuvent être partagées dans les cas suivants :
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>
                  <strong>Entre utilisateurs :</strong> Les clients voient les
                  informations publiques des profils avocats. Les avocats voient
                  le nom et email des clients qui les contactent.
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

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                5. Sécurité des données
              </h2>
              <p className="text-slate-700 leading-relaxed mb-3">
                Nous mettons en œuvre des mesures de sécurité appropriées :
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>Cryptage des mots de passe</li>
                <li>Connexion sécurisée HTTPS</li>
                <li>Hébergement sur serveurs sécurisés</li>
                <li>Accès limité aux données personnelles</li>
                <li>Sauvegardes régulières</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                6. Cookies et technologies similaires
              </h2>
              <p className="text-slate-700 leading-relaxed">
                Le site MIZAN utilise des cookies essentiels pour son
                fonctionnement (authentification, préférences). Nous n'utilisons
                pas de cookies publicitaires ou de tracking tiers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                7. Vos droits
              </h2>
              <p className="text-slate-700 leading-relaxed mb-3">
                Vous disposez des droits suivants :
              </p>
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
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                8. Conservation des données
              </h2>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>
                  <strong>Comptes actifs :</strong> Données conservées tant que
                  le compte existe
                </li>
                <li>
                  <strong>Comptes supprimés :</strong> Données effacées sous 30
                  jours, sauf obligations légales de conservation
                </li>
                <li>
                  <strong>Avis publiés :</strong> Conservés de manière
                  anonymisée après suppression du compte
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                9. Modifications de cette politique
              </h2>
              <p className="text-slate-700 leading-relaxed">
                Nous pouvons modifier cette politique de confidentialité. Les
                modifications importantes vous seront notifiées par email. Nous
                vous encourageons à consulter régulièrement cette page.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                10. Contact
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Pour toute question concernant vos données personnelles :
              </p>

              <a
                href="mailto:contact@mizan-dz.com?subject=Question sur la confidentialité"
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
