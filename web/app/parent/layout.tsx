import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ParentShell from "@/components/parent/ParentShell";
import { requireParentSession } from "@/lib/parent-session";
import { buildParentDashboardData } from "@/lib/parent-data";
import { SITE_NAME } from "@/lib/site";

/**
 * Métadonnées de l'espace parent.
 *
 * `noindex, nofollow, nocache` : ces pages affichent un nom, une référence de
 * dossier, une situation financière et un suivi psychosocial. Elles ne doivent
 * jamais être indexées, ni suivies, ni mises en cache par un intermédiaire.
 * C'est la protection principale ; la directive `Disallow: /parent` du
 * robots.txt ne fait que la compléter.
 *
 * Le gabarit de titre est **redéclaré ici**, et non hérité du layout racine.
 * Vérifié en production : un layout intermédiaire qui déclare son `title` sous
 * forme de chaîne simple interrompt la propagation du gabarit racine vers ses
 * petits-enfants — `/parent` recevait bien « | EA-POMRA », mais
 * `/parent/parcours` et consorts non. Redéclarer `template` ici garantit que
 * toute page du portail, à n'importe quelle profondeur, porte le suffixe.
 */
export const metadata: Metadata = {
  title: {
    default: "Espace parent",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Suivi du parcours de mobilité étudiante : étapes du dossier, scolarité, simulation STSS et accompagnement psychosocial.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

/**
 * Layout serveur du portail Parent.
 *
 * Deux responsabilités, et deux seulement :
 *   1. vérifier la session **côté serveur** avant de rendre quoi que ce soit ;
 *   2. alimenter la coquille visuelle avec les données du dossier.
 *
 * Les composants clients ne reçoivent que des chaînes déjà filtrées : ils n'ont
 * aucun accès à `lib/parent-data.ts`, qui reste un module serveur.
 */
export default async function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireParentSession();
  const data = await buildParentDashboardData();

  // Contrôle de rattachement. La session porte la référence du seul dossier
  // qu'elle autorise : sans ce test, il suffirait de changer une référence pour
  // lire le dossier d'une autre famille. Le contrôle est ici, côté serveur, et
  // non dans un composant client.
  if (session.studentReference !== data.student.reference) {
    notFound();
  }

  const { parent, student, messages, notifications } = data;

  return (
    <ParentShell
      parentName={parent.fullName}
      parentRelation={parent.relation}
      studentDisplayName={student.displayName}
      studentReference={student.reference}
      studentInitials={student.initials}
      hostCity={student.hostCity}
      hostFlag={student.hostFlag}
      antenneCountry={parent.antenneCountry}
      antenneFlag={parent.antenneFlag}
      antennePhone={parent.antennePhone}
      antenneEmail={parent.antenneEmail}
      isDemoSession={session.isDemo}
      unreadMessages={messages.filter((message) => !message.read).length}
      unreadNotifications={
        notifications.filter((notification) => !notification.read).length
      }
    >
      {children}
    </ParentShell>
  );
}
