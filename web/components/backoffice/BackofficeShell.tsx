"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Folder,
  Compass,
  ArrowLeftRight,
  GraduationCap,
  FileText,
  ShieldCheck,
  BarChart3,
  Bell,
  History,
  CheckCircle2,
  Activity,
  LogOut,
  Menu,
  X,
  Search,
  ClipboardCheck,
  ChevronRight,
} from "lucide-react";
import type { BackofficeRole } from "@/lib/backoffice-types";
import { rootHref } from "@/lib/backoffice-nav";
import { logout } from "@/app/backoffice/actions";

/**
 * Coquille des back-offices Antenne et BEC.
 *
 * Référence : spec §5 (layout), §6 et §7 (navigation), §28 (responsive),
 * §29 (échelle de z-index).
 *
 * Un seul composant sert les deux rôles : la navigation est dérivée du rôle, ce
 * qui garantit que les deux back-offices partagent exactement la même structure,
 * les mêmes espacements et le même comportement responsive. Deux coquilles
 * séparées auraient divergé dès le premier correctif.
 *
 * Composant client parce qu'il est interactif (route active, panneau latéral
 * mobile, recherche). Les données du dossier n'y entrent pas : elles sont
 * rendues par les composants serveur passés en `children`.
 */
export interface BackofficeShellProps {
  role: BackofficeRole;
  userName: string;
  userTitle: string;
  /** « Antenne Sénégal » ou « Vue consolidée — 8 pays ». */
  scopeLabel: string;
  scopeFlag: string | null;
  /** Nombre d'éléments en attente, affiché en badge sur « Dossiers ». */
  pendingCount: number;
  isDemo: boolean;
  children: React.ReactNode;
}

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: boolean;
}

const ANTENNE_NAV: NavItem[] = [
  { href: "/antenne", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/antenne/dossiers", label: "Dossiers", icon: Folder, badge: true },
  { href: "/antenne/orientation", label: "Orientation", icon: Compass },
  { href: "/antenne/mobilite", label: "Mobilité", icon: ArrowLeftRight },
  { href: "/antenne/suivi", label: "Suivi", icon: GraduationCap },
  { href: "/antenne/documents", label: "Documents", icon: FileText },
  { href: "/antenne/stss", label: "STSS", icon: ShieldCheck },
  { href: "/antenne/rapports", label: "Rapports", icon: BarChart3 },
  { href: "/antenne/notifications", label: "Notifications", icon: Bell },
  { href: "/antenne/historique", label: "Historique", icon: History },
];

const BEC_NAV: NavItem[] = [
  { href: "/bec", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/bec/dossiers", label: "Dossiers", icon: Folder, badge: true },
  { href: "/bec/validation", label: "Validation", icon: CheckCircle2, badge: true },
  { href: "/bec/statistiques", label: "Statistiques", icon: BarChart3 },
  { href: "/bec/rapports", label: "Rapports", icon: FileText },
  { href: "/bec/activite", label: "Activité", icon: Activity },
  { href: "/bec/notifications", label: "Notifications", icon: Bell },
  { href: "/bec/historique", label: "Historique", icon: History },
];

const OCO_NAV: NavItem[] = [
  { href: "/oco", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/oco/dossiers", label: "Dossiers affectés", icon: Folder, badge: true },
  { href: "/oco/avis", label: "Avis OCO", icon: ClipboardCheck, badge: true },
  { href: "/oco/historique", label: "Historique", icon: History },
];

/**
 * L'onglet racine (`/antenne`, `/bec`) est préfixe de tous les autres : une
 * comparaison par `startsWith` l'activerait sur chaque page.
 */
function isRouteActive(href: string, pathname: string): boolean {
  if (href === "/antenne" || href === "/bec" || href === "/oco") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function navFor(role: BackofficeRole): NavItem[] {
  if (role === "BEC") return BEC_NAV;
  if (role === "EXPERT_OCO") return OCO_NAV;
  return ANTENNE_NAV;
}

export default function BackofficeShell({
  role,
  userName,
  userTitle,
  scopeLabel,
  scopeFlag,
  pendingCount,
  isDemo,
  children,
}: BackofficeShellProps) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navItems = navFor(role);
  const activeItem = navItems.find((item) => isRouteActive(item.href, pathname));
  const root = rootHref(role);
  const roleLabel = role === "BEC" ? "BACK-OFFICE BEC" : role === "EXPERT_OCO" ? "EXPERT OCO" : "BACK-OFFICE ANTENNE";

  /** Contenu de la barre latérale, mutualisé entre la version fixe et le panneau mobile. */
  const sidebarContent = (
    <>
      <div className="space-y-5">
        <Link href="/" className="flex items-center gap-3 px-1">
          <span className="w-10 h-10 rounded-full overflow-hidden bg-white border border-[#E6E9EF] flex items-center justify-center p-0.5 shrink-0">
            <Image
              src="/assets/logo-ea-pomra-round.png"
              alt="Logo EA-POMRA"
              width={40}
              height={40}
              className="object-contain"
            />
          </span>
          <span>
            <span className="block font-extrabold text-base tracking-tight text-[#0D2B4D]">
              EA-POMRA
            </span>
            <span className="block text-[10px] text-[#667085] font-medium">
              ÉTUDIER EN AFRIQUE
            </span>
          </span>
        </Link>

        <div className="px-3 py-2 rounded-xl bg-[#F7F9FB] border border-[#E6E9EF]">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-[#667085]">
            {roleLabel}
          </span>
          <span className="mt-1 flex items-center gap-1.5 text-xs font-bold text-[#0D2B4D]">
            {scopeFlag ? <span aria-hidden="true">{scopeFlag}</span> : null}
            {scopeLabel}
          </span>
        </div>

        <nav aria-label="Navigation principale" className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isRouteActive(item.href, pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setMobileNavOpen(false)}
                className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors ${
                  active
                    ? "bg-[#EBF3FA] text-[#174A7C] font-bold"
                    : "text-[#667085] hover:bg-[#F7F9FB] hover:text-[#0D2B4D]"
                }`}
              >
                <span className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${active ? "text-[#174A7C]" : "text-[#98A2B3]"}`}
                  />
                  <span className="truncate">{item.label}</span>
                </span>
                {item.badge && pendingCount > 0 ? (
                  <span className="min-w-5 h-5 px-1.5 rounded-full bg-[#174A7C] text-white text-[10px] font-bold flex items-center justify-center">
                    {pendingCount}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 mt-4 border-t border-[#E6E9EF] space-y-0.5">
        {/* La navigation s'arrête aux sections listées par la spec §6 et §7.
            Aucun lien vers une page inexistante : un back-office dont la moitié
            des entrées mène à un 404 est pire qu'un back-office plus court. */}

        <form action={logout}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-[#667085] hover:bg-[#F7F9FB] hover:text-[#0D2B4D]"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </form>

        {isDemo ? (
          <p className="mt-2 px-3 py-2 rounded-lg bg-[#FEF7EC] border border-[#FDE5C5] text-[10px] leading-tight text-[#B86E00]">
            Environnement de démonstration — données fictives, accès non
            authentifié.
          </p>
        ) : null}
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#F7F9FB] font-jakarta">
      {/* 1. Barre latérale fixe — 248 px (spec §5), masquée sous lg */}
      <aside
        className="hidden lg:flex fixed inset-y-0 left-0 w-[248px] bg-white border-r border-[#E6E9EF] px-4 py-5 flex-col justify-between overflow-y-auto"
        style={{ zIndex: "var(--eap-z-sticky)" }}
      >
        {sidebarContent}
      </aside>

      {/* 2. Panneau latéral mobile (spec §28 : sidebar → Sheet) */}
      {mobileNavOpen ? (
        <div
          className="lg:hidden fixed inset-0 bg-black/40"
          style={{ zIndex: "var(--eap-z-overlay)" }}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          <div className="absolute inset-y-0 left-0 w-[280px] max-w-[85vw] bg-white px-4 py-5 flex flex-col justify-between overflow-y-auto">
            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              aria-label="Fermer la navigation"
              className="absolute top-4 right-4 text-[#667085] hover:text-[#0D2B4D]"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </div>
        </div>
      ) : null}

      {/* 3. Zone principale */}
      <div className="lg:ml-[248px] flex flex-col min-h-screen">
        {/* En-tête — 76 px desktop, 64 px mobile (spec §28) */}
        <header
          className="sticky top-0 bg-white border-b border-[#E6E9EF] px-4 sm:px-8 h-16 lg:h-[76px] flex items-center gap-3 shrink-0"
          style={{ zIndex: "var(--eap-z-dropdown)" }}
        >
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Ouvrir la navigation"
            className="lg:hidden w-9 h-9 rounded-lg border border-[#E6E9EF] flex items-center justify-center text-[#0D2B4D]"
          >
            <Menu className="w-4 h-4" />
          </button>

          <nav aria-label="Fil d'ariane" className="min-w-0 flex-1">
            <ol className="flex items-center gap-1.5 text-xs text-[#667085] min-w-0">
              <li className="shrink-0">
                <Link href={root} className="hover:text-[#0D2B4D]">
                  {role === "BEC" ? "BEC" : role === "EXPERT_OCO" ? "OCO" : "Antenne"}
                </Link>
              </li>
              {activeItem && activeItem.href !== root ? (
                <>
                  <li aria-hidden="true" className="shrink-0">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </li>
                  <li className="truncate font-semibold text-[#0D2B4D]">
                    {activeItem.label}
                  </li>
                </>
              ) : null}
            </ol>
            <p className="text-[11px] text-[#98A2B3] truncate mt-0.5">
              {scopeLabel}
            </p>
          </nav>

          <Link
             href={`${root}/dossiers`}
            aria-label="Rechercher un dossier"
            className="w-9 h-9 rounded-lg border border-[#E6E9EF] flex items-center justify-center text-[#667085] hover:bg-[#F7F9FB] hover:text-[#0D2B4D] transition-colors"
          >
            <Search className="w-4 h-4" />
          </Link>

          <Link
             href={role === "EXPERT_OCO" ? "/oco/avis" : `${root}/notifications`}
            aria-label="Notifications"
            className="relative w-9 h-9 rounded-lg border border-[#E6E9EF] flex items-center justify-center text-[#667085] hover:bg-[#F7F9FB] hover:text-[#0D2B4D] transition-colors"
          >
            <Bell className="w-4 h-4" />
            {pendingCount > 0 ? (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#F59E0B] text-white text-[10px] font-bold flex items-center justify-center">
                {pendingCount}
              </span>
            ) : null}
          </Link>

          <div className="flex items-center gap-2.5 pl-3 border-l border-[#E6E9EF]">
            <span
              aria-hidden="true"
              className="w-9 h-9 rounded-full bg-[#0D2B4D] text-white text-xs font-bold flex items-center justify-center shrink-0"
            >
              {userName
                .replace(/^(M\.|Mme|Dr\.?)\s+/, "")
                .split(" ")
                .slice(0, 2)
                .map((part) => part.charAt(0))
                .join("")
                .toUpperCase()}
            </span>
            <span className="hidden md:block min-w-0">
              <span className="block text-xs font-bold text-[#0D2B4D] truncate max-w-[180px]">
                {userName}
              </span>
              <span className="block text-[10px] text-[#98A2B3] truncate max-w-[180px]">
                {userTitle}
              </span>
            </span>
          </div>
        </header>

        {/* Contenu — padding 32 px, conteneur 1184 px (spec §5) */}
        <main className="flex-1 w-full px-4 py-5 sm:px-6 sm:py-6 lg:p-8">
          <div className="mx-auto w-full max-w-[1184px] space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
