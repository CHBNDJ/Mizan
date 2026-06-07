// "use client";

// import { ArrowLeft, ChevronDown } from "lucide-react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { useState, useEffect, useRef } from "react";
// import { gsap } from "gsap";

// export default function FAQPage() {
//   const router = useRouter();
//   const [openIndex, setOpenIndex] = useState<number | null>(null);
//   const [activeTab, setActiveTab] = useState("Général");
//   const containerRef = useRef<HTMLDivElement>(null);

//   const faqs = [
//     {
//       category: "Général",
//       questions: [
//         {
//           q: "Qu'est-ce que Mizan ?",
//           a: "Mizan est une plateforme en ligne qui met en relation des clients à la recherche de services juridiques avec des avocats inscrits au barreau en Algérie. Nous facilitons la recherche et la prise de contact avec les professionnels du droit.",
//         },
//         {
//           q: "L'utilisation de Mizan est-elle gratuite ?",
//           a: "Oui, l'inscription et la recherche d'avocats sont entièrement gratuites pour les clients. Les avocats peuvent également réclamer et gérer leur profil gratuitement.",
//         },
//         {
//           q: "Comment contacter le support ?",
//           a: "Vous pouvez nous contacter via notre page de contact ou directement par email à support@mizan-dz.com pour les questions techniques.",
//         },
//       ],
//     },
//     {
//       category: "Pour les clients",
//       questions: [
//         {
//           q: "Comment trouver un avocat ?",
//           a: "Utilisez notre moteur de recherche en page d'accueil pour filtrer les avocats par spécialité juridique et localisation (wilaya). Vous pouvez affiner votre recherche selon vos besoins.",
//         },
//         {
//           q: "Puis-je consulter un avocat depuis l'étranger ?",
//           a: "Oui, la messagerie Mizan fonctionne depuis n'importe quel pays. Les membres de la diaspora algérienne peuvent contacter un avocat algérien directement depuis la France, le Canada ou ailleurs.",
//         },
//         {
//           q: "Comment contacter un avocat ?",
//           a: "Visitez le profil de l'avocat et utilisez le formulaire de contact. L'avocat recevra votre demande par email et pourra vous répondre directement.",
//         },
//         {
//           q: "Puis-je laisser un avis ?",
//           a: "Oui, vous pouvez laisser un avis après avoir consulté un avocat. Les avis sont soumis à modération pour garantir leur authenticité et leur pertinence.",
//         },
//         {
//           q: "Les avocats sont-ils vérifiés ?",
//           a: "Oui, tous les avocats sur Mizan doivent prouver leur inscription au barreau en Algérie. Nous vérifions leurs documents avant d'activer leur profil.",
//         },
//       ],
//     },
//     {
//       category: "Pour les avocats",
//       questions: [
//         {
//           q: "Comment réclamer mon profil ?",
//           a: "Si vous trouvez votre profil sur Mizan, cliquez sur 'Réclamer ce profil'. Vous recevrez un code de vérification sur votre email professionnel pour confirmer votre identité.",
//         },
//         {
//           q: "Comment modifier mon profil ?",
//           a: "Après avoir réclamé votre profil, connectez-vous à votre espace personnel. Vous pourrez modifier vos informations, spécialités, coordonnées et ajouter une photo.",
//         },
//         {
//           q: "Qui peut voir mes coordonnées ?",
//           a: "Vos coordonnées professionnelles (téléphone, adresse cabinet) sont visibles sur votre profil public. Votre email professionnel est utilisé uniquement pour les notifications système.",
//         },
//         {
//           q: "Comment supprimer mon profil ?",
//           a: "Vous pouvez supprimer votre profil directement depuis les paramètres de votre compte. La suppression est immédiate et définitive.",
//         },
//         {
//           q: "Comment recevoir des demandes de consultation ?",
//           a: "Lorsqu'un client vous contacte via votre profil, vous recevez une notification par email. Vous pouvez ensuite répondre directement au client.",
//         },
//       ],
//     },
//     {
//       category: "Confidentialité",
//       questions: [
//         {
//           q: "Mes données sont-elles sécurisées ?",
//           a: "Oui, nous utilisons des protocoles de sécurité avancés (HTTPS, cryptage des mots de passe) et hébergeons vos données sur des serveurs sécurisés Supabase.",
//         },
//         {
//           q: "Qui a accès à mes informations personnelles ?",
//           a: "Vos données personnelles ne sont jamais vendues. Seules les informations publiques de votre profil sont visibles par les utilisateurs. Consultez notre Politique de Confidentialité pour plus de détails.",
//         },
//         {
//           q: "Comment exercer mes droits RGPD ?",
//           a: "Vous pouvez exercer vos droits d'accès, rectification ou suppression en nous contactant à contact@mizan-dz.com ou directement depuis les paramètres de votre compte.",
//         },
//         {
//           q: "Les avis sont-ils modérés ?",
//           a: "Oui, tous les avis publiés sont soumis à une modération pour garantir leur authenticité et éviter les abus.",
//         },
//       ],
//     },
//   ];

//   const tabs = [
//     "Général",
//     "Pour les clients",
//     "Pour les avocats",
//     "Confidentialité",
//   ];

//   const filteredFaqs = faqs.filter(
//     (category) => category.category === activeTab
//   );

//   useEffect(() => {
//     if (!containerRef.current) return;
//     const timeline = gsap.timeline();
//     timeline
//       .fromTo(
//         ".back-btn",
//         { opacity: 0, y: -20 },
//         { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
//       )
//       .fromTo(
//         ".main-title",
//         { opacity: 0, y: -30 },
//         { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
//         "-=0.3"
//       )
//       .fromTo(
//         ".subtitle",
//         { opacity: 0, y: -20 },
//         { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
//         "-=0.4"
//       )
//       .fromTo(
//         ".tabs-wrapper",
//         { opacity: 0, y: -20 },
//         { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
//         "-=0.3"
//       )
//       .fromTo(
//         ".cta-block",
//         { opacity: 0, y: 30 },
//         { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
//         "-=0.2"
//       );
//   }, []);

//   useEffect(() => {
//     const faqItems = document.querySelectorAll(".faq-item");
//     gsap.fromTo(
//       faqItems,
//       { opacity: 0, y: 20 },
//       {
//         opacity: 1,
//         y: 0,
//         duration: 0.6,
//         stagger: 0.08,
//         ease: "power2.out",
//         delay: 0.1,
//       }
//     );
//   }, [activeTab]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-teal-100 via-white to-teal-100">
//       <style>{`
//         .back-btn, .main-title, .subtitle, .tabs-wrapper, .faq-item, .cta-block { opacity: 0; }
//       `}</style>

//       <div className="max-w-4xl mx-auto px-5 py-16" ref={containerRef}>
//         <button
//           onClick={() => router.back()}
//           className="back-btn cursor-pointer inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-all mb-8 text-sm font-medium"
//         >
//           <ArrowLeft size={18} />
//           <span>Retour</span>
//         </button>

//         <div className="text-center mb-10">
//           <h1 className="main-title text-4xl font-bold text-slate-900 mb-3">
//             Questions Fréquentes
//           </h1>
//           <p className="subtitle text-lg text-slate-600 max-w-2xl mx-auto">
//             Trouvez rapidement les réponses à vos questions
//           </p>
//         </div>

//         <div className="tabs-wrapper mb-8">
//           <div className="flex flex-wrap justify-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200">
//             {tabs.map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`px-4 py-2 rounded-lg font-medium text-sm transition-all cursor-pointer ${
//                   activeTab === tab
//                     ? "bg-teal-600 text-white shadow-sm"
//                     : "text-slate-600 hover:bg-slate-50"
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>
//         </div>

//         {filteredFaqs.length > 0 ? (
//           <div className="space-y-3">
//             {filteredFaqs.map((category, categoryIndex) =>
//               category.questions.map((faq, faqIndex) => {
//                 const globalIndex = categoryIndex * 100 + faqIndex;
//                 const isOpen = openIndex === globalIndex;
//                 return (
//                   <div
//                     key={faqIndex}
//                     className="faq-item bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-teal-200 transition-all"
//                   >
//                     <button
//                       onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
//                       className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
//                     >
//                       <span className="font-semibold text-slate-900 pr-4 text-sm md:text-base">
//                         {faq.q}
//                       </span>
//                       <ChevronDown
//                         className={`w-5 h-5 text-teal-600 transition-transform duration-300 flex-shrink-0 ${
//                           isOpen ? "rotate-180" : ""
//                         }`}
//                       />
//                     </button>
//                     <div
//                       className={`overflow-hidden transition-all duration-300 ${
//                         isOpen ? "max-h-96" : "max-h-0"
//                       }`}
//                     >
//                       <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3">
//                         {faq.a}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>
//         ) : (
//           <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
//             <div className="text-5xl mb-4">🔍</div>
//             <h3 className="text-xl font-bold text-slate-900 mb-2">
//               Aucun résultat
//             </h3>
//             <p className="text-slate-600">Contactez-nous directement.</p>
//           </div>
//         )}

//         <div className="cta-block mt-12 bg-white rounded-xl border border-slate-200 p-8">
//           <div className="flex flex-col md:flex-row items-center justify-between gap-6">
//             <div className="text-center md:text-left">
//               <h3 className="text-xl font-bold text-slate-900 mb-1">
//                 Vous ne trouvez pas votre réponse ?
//               </h3>
//               <p className="text-slate-500 text-sm">
//                 Notre équipe est là pour vous aider rapidement
//               </p>
//             </div>
//             <Link
//               href="/contact"
//               className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-xl transition-all whitespace-nowrap"
//             >
//               Contactez-nous
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function FAQPage() {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("Général");
  const containerRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      category: "Général",
      questions: [
        {
          q: "Qu'est-ce que Mizan ?",
          a: "Mizan est une plateforme en ligne qui met en relation des clients avec des professionnels du droit et du chiffre vérifiés en Algérie : avocats, notaires, huissiers de justice et comptables. Simple, direct, sans intermédiaire.",
        },
        {
          q: "L'utilisation de Mizan est-elle gratuite ?",
          a: "Oui, l'inscription et la recherche de professionnels sont entièrement gratuites pour les clients.",
        },
        {
          q: "Quels professionnels puis-je trouver ?",
          a: "Avocats inscrits au barreau, notaires agréés par la chambre des notaires, huissiers de justice assermentés, et comptables agréés ONEC ou ONCA.",
        },
        {
          q: "Les professionnels sont-ils vérifiés ?",
          a: "Oui. Chaque professionnel est vérifié par notre équipe avant activation. Nous contrôlons leur inscription officielle (barreau, chambre des notaires, numéro d'huissier, agrément ONEC/ONCA).",
        },
        {
          q: "Comment contacter le support ?",
          a: "Vous pouvez nous contacter à support@mizan-dz.com pour toute question technique, ou professionnel@mizan-dz.com pour les questions liées aux profils professionnels.",
        },
      ],
    },
    {
      category: "Pour les clients",
      questions: [
        {
          q: "Comment trouver un professionnel ?",
          a: "Choisissez la catégorie d'expert depuis la page d'accueil (avocat, notaire, huissier ou comptable), puis filtrez par wilaya et domaine d'intervention sur la page de recherche.",
        },
        {
          q: "Puis-je consulter depuis l'étranger ?",
          a: "Oui, la messagerie Mizan fonctionne depuis n'importe quel pays. La diaspora algérienne peut contacter un avocat, notaire ou comptable depuis la France, le Canada ou ailleurs.",
        },
        {
          q: "Quelle différence entre un notaire et un avocat ?",
          a: "L'avocat représente et conseille en justice. Le notaire établit des actes officiels — immobilier, successions, mariages, contrats. Les deux sont accessibles via Mizan.",
        },
        {
          q: "À quoi sert un huissier ?",
          a: "Le huissier intervient pour les constats officiels, l'exécution des jugements, le recouvrement de créances et les significations d'actes.",
        },
        {
          q: "Quand faire appel à un comptable ?",
          a: "Pour la création d'entreprise (EURL, SARL), les bilans annuels, les déclarations fiscales (IFU, G50, IBS), ou tout conseil en gestion d'entreprise en Algérie.",
        },
        {
          q: "Les avis sont-ils fiables ?",
          a: "Tous les avis Mizan sont soumis à modération avant publication. Les avis Google proviennent de Google Business et sont affichés tels quels.",
        },
        {
          q: "Puis-je contacter plusieurs professionnels ?",
          a: "Oui, vous pouvez envoyer des demandes à plusieurs professionnels en parallèle. Chaque conversation est indépendante et privée.",
        },
      ],
    },
    {
      category: "Pour les avocats",
      questions: [
        {
          q: "Comment réclamer mon profil ?",
          a: "Si vous trouvez votre profil sur Mizan, cliquez sur 'Réclamer ce profil'. Vous recevrez un code de vérification sur votre email professionnel inscrit au barreau.",
        },
        {
          q: "L'inscription est-elle payante ?",
          a: "L'inscription est gratuite. Un abonnement optionnel (3, 6 ou 12 mois) améliore votre visibilité dans les résultats de recherche. Le paiement en ligne sera disponible prochainement.",
        },
        {
          q: "Comment modifier mon profil ?",
          a: "Depuis votre espace personnel, vous pouvez modifier vos informations, spécialités, langues et coordonnées à tout moment.",
        },
        {
          q: "Comment recevoir des demandes ?",
          a: "Les clients vous contactent via la messagerie intégrée. Vous recevez une notification email à chaque nouvelle demande.",
        },
        {
          q: "La publicité est-elle autorisée ?",
          a: "Figurer dans un annuaire numérique vérifié est légalement autorisé et conforme à la déontologie du barreau algérien — il ne s'agit pas de publicité personnelle au sens de l'article 47 de la loi 13-07.",
        },
        {
          q: "Quelles spécialités puis-je afficher ?",
          a: "Toutes les branches du droit : civil, pénal, commercial, famille, immobilier, travail, administratif, international... Vous choisissez jusqu'à 10 spécialités.",
        },
        {
          q: "Mon profil est-il visible à l'étranger ?",
          a: "Oui. Mizan est accessible depuis la France, le Canada, et toute la diaspora. Votre profil est visible pour tous les clients connectés, où qu'ils soient.",
        },
      ],
    },
    {
      category: "Notaires",
      questions: [
        {
          q: "Puis-je m'inscrire en tant que notaire ?",
          a: "Oui. Votre numéro de chambre des notaires sera requis pour vérification. Votre profil apparaît dans les résultats après validation sous 24-48h.",
        },
        {
          q: "Quels actes puis-je proposer sur Mizan ?",
          a: "Actes immobiliers (vente, hypothèque), successions et héritages, contrats de mariage, donations, procurations, création d'entreprise, légalisations.",
        },
        {
          q: "La diaspora peut-elle me contacter ?",
          a: "Oui, c'est l'un des cas d'usage les plus fréquents. La diaspora a besoin de notaires pour successions, actes immobiliers en Algérie, procurations. Mizan vous rend visible depuis l'étranger.",
        },
        {
          q: "La publicité est-elle autorisée pour les notaires ?",
          a: "Figurer dans un annuaire numérique vérifié est autorisé et conforme à la déontologie notariale. Il ne s'agit pas d'une publicité personnelle mais d'un référencement professionnel.",
        },
        {
          q: "Les clients peuvent-ils envoyer des documents ?",
          a: "Oui, via la messagerie Mizan. Les clients peuvent joindre des titres de propriété, actes de naissance ou autres documents à leurs demandes.",
        },
        {
          q: "Comment les clients me trouvent-ils ?",
          a: "Via la recherche par wilaya et domaine. Un client qui cherche 'Notaire — Successions — Alger' verra votre profil si vous êtes inscrit et vérifié.",
        },
        {
          q: "Mon numéro de chambre est-il affiché publiquement ?",
          a: "Oui, il apparaît sur votre profil public comme preuve de votre inscription officielle. Cela renforce la confiance des clients.",
        },
      ],
    },
    {
      category: "Huissiers",
      questions: [
        {
          q: "Puis-je m'inscrire en tant que huissier de justice ?",
          a: "Oui. Votre numéro officiel d'huissier de justice sera requis. Votre profil apparaît après validation sous 24-48h.",
        },
        {
          q: "Quels services puis-je proposer ?",
          a: "Constats officiels (état des lieux, constat d'affichage, constat internet), exécution de jugements, significations d'actes, recouvrement de créances, saisies, procès-verbaux.",
        },
        {
          q: "Des demandes d'urgence sont-elles possibles ?",
          a: "Oui. La messagerie Mizan permet aux clients d'indiquer l'urgence de leur demande. Vous gérez ensuite les priorités depuis votre tableau de bord.",
        },
        {
          q: "Quelle est ma zone de compétence sur Mizan ?",
          a: "Vous définissez votre wilaya de compétence dans votre profil. Les clients filtrent par wilaya, donc vous apparaissez uniquement pour votre zone d'intervention.",
        },
        {
          q: "La publicité est-elle autorisée pour les huissiers ?",
          a: "Figurer dans un annuaire numérique vérifié est conforme aux règles déontologiques de la profession d'huissier de justice en Algérie.",
        },
        {
          q: "Des entreprises peuvent-elles me contacter ?",
          a: "Oui. Particuliers et entreprises utilisent Mizan. Les entreprises recherchent notamment des huissiers pour le recouvrement de créances et les constats commerciaux.",
        },
        {
          q: "L'inscription est-elle payante ?",
          a: "L'inscription est gratuite. Un abonnement optionnel améliore votre visibilité dans les résultats de recherche.",
        },
      ],
    },
    {
      category: "Comptables",
      questions: [
        {
          q: "Expert-comptable ou comptable agréé — quelle différence ?",
          a: "L'expert-comptable (ONEC) peut signer des bilans officiels et faire de la commissariat aux comptes. Le comptable agréé (ONCA) gère la comptabilité courante, les déclarations et les bulletins de paie. Les deux peuvent s'inscrire sur Mizan.",
        },
        {
          q: "Quel numéro est requis pour l'inscription ?",
          a: "Votre numéro d'agrément ONEC (Ordre National des Experts-Comptables) ou ONCA (Ordre National des Comptables Agréés) selon votre statut.",
        },
        {
          q: "Quels services puis-je proposer ?",
          a: "Création d'entreprise (EURL, SARL, SPA), déclarations IFU/G50/IBS, bilan annuel et comptes de résultat, paie et cotisations sociales, conseil fiscal, comptabilité générale.",
        },
        {
          q: "La diaspora est-elle une cible pertinente ?",
          a: "Absolument. Les Algériens de l'étranger qui créent une EURL ou SARL en Algérie ont besoin d'un comptable local. Mizan vous rend visible depuis la France, le Canada ou ailleurs.",
        },
        {
          q: "Les missions peuvent-elles se faire à distance ?",
          a: "Oui. La plupart des missions comptables (bilans, déclarations, conseil) se font par échange de documents et messagerie. Mizan facilite ce flux dès le premier contact.",
        },
        {
          q: "La publicité est-elle autorisée pour les comptables ?",
          a: "Figurer dans un annuaire vérifié est autorisé et conforme à la déontologie ONEC/ONCA. Ce n'est pas une publicité personnelle mais un référencement professionnel.",
        },
        {
          q: "L'inscription est-elle payante ?",
          a: "L'inscription est gratuite. Un abonnement optionnel améliore votre visibilité dans les résultats de recherche.",
        },
      ],
    },
    {
      category: "Confidentialité",
      questions: [
        {
          q: "Mes données sont-elles sécurisées ?",
          a: "Oui, nous utilisons des protocoles de sécurité avancés (HTTPS, cryptage) et hébergeons vos données sur des serveurs Supabase sécurisés en Singapour.",
        },
        {
          q: "Qui a accès à mes informations ?",
          a: "Vos données personnelles ne sont jamais vendues. Seules les informations publiques de votre profil sont visibles par les autres utilisateurs.",
        },
        {
          q: "Comment exercer mes droits ?",
          a: "Vous pouvez exercer vos droits d'accès, rectification ou suppression en nous contactant à contact@mizan-dz.com. Délai de traitement : 15 jours ouvrés.",
        },
        {
          q: "Les avis sont-ils modérés ?",
          a: "Oui, tous les avis Mizan sont soumis à modération avant publication. Les avis frauduleux ou diffamatoires sont supprimés.",
        },
        {
          q: "Puis-je supprimer mon compte ?",
          a: "Oui, depuis les paramètres de votre espace personnel. Vos données sont effacées sous 30 jours, sauf obligations légales de conservation.",
        },
      ],
    },
  ];

  const tabs = faqs.map((f) => f.category);

  useEffect(() => {
    if (!containerRef.current) return;
    gsap
      .timeline()
      .fromTo(
        ".back-btn",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      )
      .fromTo(
        ".main-title",
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.3"
      )
      .fromTo(
        ".subtitle",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        "-=0.4"
      )
      .fromTo(
        ".tabs-wrapper",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo(
        ".cta-block",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        "-=0.2"
      );
  }, []);

  useEffect(() => {
    gsap.fromTo(
      ".faq-item",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.1,
      }
    );
    setOpenIndex(null);
  }, [activeTab]);

  const filteredFaqs = faqs.filter((c) => c.category === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 via-white to-teal-100">
      <style>{`.back-btn,.main-title,.subtitle,.tabs-wrapper,.faq-item,.cta-block{opacity:0;}`}</style>
      <div className="max-w-4xl mx-auto px-5 py-16" ref={containerRef}>
        <button
          onClick={() => router.back()}
          className="back-btn cursor-pointer inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-8 text-sm font-medium"
        >
          <ArrowLeft size={18} /> Retour
        </button>

        <div className="text-center mb-10">
          <h1 className="main-title text-4xl font-bold text-slate-900 mb-3">
            Questions Fréquentes
          </h1>
          <p className="subtitle text-lg text-slate-600 max-w-2xl mx-auto">
            Trouvez rapidement les réponses à vos questions
          </p>
        </div>

        <div className="tabs-wrapper mb-8">
          <div className="flex flex-wrap justify-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all cursor-pointer ${activeTab === tab ? "bg-teal-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredFaqs.map((cat) =>
            cat.questions.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={i}
                  className="faq-item bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-teal-200 transition-all"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span className="font-semibold text-slate-900 pr-4 text-sm md:text-base">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-teal-600 transition-transform duration-300 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96" : "max-h-0"}`}
                  >
                    <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="cta-block mt-12 bg-white rounded-xl border border-slate-200 p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                Vous ne trouvez pas votre réponse ?
              </h3>
              <p className="text-slate-500 text-sm">
                Notre équipe est là pour vous aider rapidement
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-xl transition-all whitespace-nowrap"
            >
              Contactez-nous
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
