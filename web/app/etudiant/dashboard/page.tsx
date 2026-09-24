"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Folder,
  CheckCircle2,
  Clock,
  AlertCircle,
  Upload,
  MessageSquare,
  ArrowLeftRight,
  Download,
  ExternalLink,
  HelpCircle,
  Send,
} from "lucide-react";
import {
  MOCK_ACTIVE_STUDENT,
  MOCK_TIMELINE_EVENTS,
  MOCK_NOTIFICATIONS,
  STUDENT_HOST_ANTENNE,
} from "@/lib/data";

const PARCOURS = [
  { label: "Dossier soumis", date: "02/07/2026", state: "done" },
  { label: "Avis OCO", date: "18/07/2026", state: "done" },
  { label: "STSS simulé", date: "14/08/2026", state: "done" },
  { label: "Accueil local", date: "En cours", state: "current" },
] as const;

const STATUT_STYLES: Record<
  string,
  { badge: string; dot: string }
> = {
  completed: { badge: "bg-[#E8F6EF] text-[#1EA362]", dot: "bg-[#1EA362]" },
  current: { badge: "bg-[#EBF3FA] text-[#3B82F6]", dot: "bg-[#3B82F6]" },
  upcoming: { badge: "bg-[#F7F9FB] text-[#8E9BAA]", dot: "bg-[#E6E9EF]" },
};

export default function StudentDashboardPage() {
  const student = MOCK_ACTIVE_STUDENT;
  const etapesTerminees = MOCK_TIMELINE_EVENTS.filter(
    (e) => e.status === "completed"
  ).length;

  return (
    <div className="space-y-8">
      {/* Titre de la page. C'est le seul <h1> : la salutation de la coquille
          est un <p>, pour que le titre annoncé décrive la page et non le nom
          de l'utilisateur. */}
      <h1 className="text-2xl font-black text-[#0D2B4D] tracking-tight">
        Tableau de bord
      </h1>

      {/* Ligne 1 : Carte d'Identifiant & Avancement */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Carte Identifiant (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E6E9EF] shadow-eap-soft overflow-hidden flex flex-col sm:flex-row">
          {/* Côté sombre Identifiant */}
          <div className="bg-[#0D2B4D] text-white p-6 sm:p-7 sm:w-5/12 flex flex-col justify-between space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                VOTRE IDENTIFIANT
              </span>
              <div className="text-xl font-black font-mono tracking-tight text-white">
                {student.idPombra}
              </div>
              <span className="text-[11px] text-[#1EA362] font-semibold block">
                Code ID-POMRA
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-2xl w-24 h-24 flex items-center justify-center shadow-inner">
              {/* QR Code simulé haute fidélité */}
              <div className="w-full h-full border-2 border-[#0D2B4D] rounded-lg p-1 grid grid-cols-3 gap-0.5">
                <div className="bg-[#0D2B4D]"></div>
                <div></div>
                <div className="bg-[#0D2B4D]"></div>
                <div></div>
                <div className="bg-[#0D2B4D]"></div>
                <div></div>
                <div className="bg-[#0D2B4D]"></div>
                <div></div>
                <div className="bg-[#0D2B4D]"></div>
              </div>
            </div>

            <p className="text-[10px] text-slate-300 leading-tight">
              Utilisez ce code pour toutes vos interactions officielles.
            </p>
          </div>

          {/* Côté clair Données */}
          <div className="p-6 sm:p-7 sm:w-7/12 grid grid-cols-2 gap-4 flex-1">
            <div>
              <span className="text-[11px] text-[#8E9BAA] font-semibold block">
                Statut du dossier
              </span>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#E8F6EF] text-[#1EA362] text-xs font-bold mt-1">
                 Scolarité STSS simulée
              </span>
            </div>

            <div>
              <span className="text-[11px] text-[#8E9BAA] font-semibold block">
                Antenne d&apos;accueil
              </span>
              <span className="text-xs font-bold text-[#0D2B4D] mt-1 block">
                {STUDENT_HOST_ANTENNE.country}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-[#8E9BAA] font-semibold block">
                Date d&apos;inscription
              </span>
              <span className="text-xs font-bold text-[#0D2B4D] mt-1 block">
                2 Juillet 2026
              </span>
            </div>

            <div>
              <span className="text-[11px] text-[#8E9BAA] font-semibold block">
                Programme visé
              </span>
              <span className="text-xs font-bold text-[#0D2B4D] mt-1 block">
                {student.degreeLevel} — Ingénierie des Systèmes Numériques &amp; IA
              </span>
            </div>
          </div>
        </div>

        {/* Carte Avancement du parcours (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E6E9EF] p-6 shadow-eap-soft flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#EDF1F6]">
            <h3 className="text-sm font-bold text-[#0D2B4D]">
              Avancement de votre parcours
            </h3>
            <Link
              href="/etudiant/dossier"
              className="text-xs font-semibold text-[#3B82F6] hover:underline cursor-pointer"
            >
              Voir tout →
            </Link>
          </div>

          {/* Stepper horizontal avec 4 étapes */}
          <div className="grid grid-cols-4 gap-2 pt-3 text-center">
            {PARCOURS.map((etape, idx) => {
              const done = etape.state === "done";
              const current = etape.state === "current";
              return (
                <div key={etape.label} className={`space-y-1.5 ${current ? "" : done ? "" : "opacity-60"}`}>
                  <div
                    className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center mx-auto ${
                      done
                        ? "bg-[#1EA362] text-white"
                        : current
                        ? "bg-[#3B82F6] text-white ring-4 ring-[#EBF3FA]"
                        : "bg-[#E6E9EF] text-[#8E9BAA]"
                    }`}
                  >
                    {done ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <div className="text-[11px] font-bold text-[#0D2B4D] leading-tight">
                    {etape.label}
                  </div>
                  <div
                    className={`text-[10px] ${
                      current ? "text-[#3B82F6] font-semibold" : "text-[#8E9BAA]"
                    }`}
                  >
                    {etape.date}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Ligne 2 : Vue d'ensemble & Actions rapides */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Vue d'ensemble (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-bold text-[#0D2B4D]">Vue d&apos;ensemble</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Stat 1 */}
            <Link href="/etudiant/documents" className="bg-white p-4 rounded-2xl border border-[#E6E9EF] shadow-xs flex items-center gap-3 hover:border-[#174A7C]/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#EBF3FA] text-[#3B82F6] flex items-center justify-center">
                <Folder className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-black text-[#0D2B4D]">7</div>
                <div className="text-[10px] text-[#5B6776]">Documents soumis</div>
              </div>
            </Link>

            {/* Stat 2 */}
            <Link href="/etudiant/dossier" className="bg-white p-4 rounded-2xl border border-[#E6E9EF] shadow-xs flex items-center gap-3 hover:border-[#1EA362]/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#E8F6EF] text-[#1EA362] flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-black text-[#0D2B4D]">{etapesTerminees}</div>
                <div className="text-[10px] text-[#5B6776]">Étapes terminées</div>
              </div>
            </Link>

            {/* Stat 3 */}
            <Link href="/etudiant/orientation" className="bg-white p-4 rounded-2xl border border-[#E6E9EF] shadow-xs flex items-center gap-3 hover:border-[#F59E0B]/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#FEF7EC] text-[#F59E0B] flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-black text-[#0D2B4D]">1</div>
                <div className="text-[10px] text-[#5B6776]">Étape en cours</div>
              </div>
            </Link>

            {/* Stat 4 */}
            <div className="bg-white p-4 rounded-2xl border border-[#E6E9EF] shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FDECEC] text-[#D9383A] flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-black text-[#0D2B4D]">0</div>
                <div className="text-[10px] text-[#5B6776]">Action en attente</div>
              </div>
            </div>
          </div>

          {/* Statut de mon dossier (Timeline) */}
          <div className="bg-white rounded-3xl border border-[#E6E9EF] p-6 shadow-eap-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDF1F6]">
              <h4 className="text-sm font-bold text-[#0D2B4D]">Statut de mon dossier</h4>
            </div>

            <div className="space-y-4">
              {MOCK_TIMELINE_EVENTS.map((event, idx) => {
                const styles = STATUT_STYLES[event.status];
                const isCompleted = event.status === "completed";
                const isCurrent = event.status === "current";
                const isLast = idx === MOCK_TIMELINE_EVENTS.length - 1;

                return (
                  <div
                    key={event.title}
                    className={`flex items-start justify-between gap-3 ${
                      isLast ? "" : "pb-3 border-b border-[#EDF1F6]"
                    } ${isCompleted ? "" : isCurrent ? "" : "opacity-60"}`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-7 h-7 rounded-full text-white font-bold text-xs flex items-center justify-center mt-0.5 shrink-0 ${
                          isCompleted
                            ? "bg-[#1EA362]"
                            : isCurrent
                            ? "bg-[#3B82F6]"
                            : "bg-[#E6E9EF] text-[#8E9BAA]"
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#0D2B4D]">{event.title}</div>
                        <div className="text-[11px] text-[#5B6776] leading-snug">
                          {event.date} — {event.actor}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${styles.badge}`}
                    >
                      {event.badgeText ?? event.status}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <Link
                href="/etudiant/dossier"
                className="text-xs font-bold text-[#3B82F6] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Voir le détail de mon dossier</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Actions rapides & Notifications (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Actions rapides */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#0D2B4D]">Actions rapides</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Action 1 */}
              <Link
                href="/etudiant/documents"
                className="p-4 rounded-2xl bg-[#E8F6EF]/60 border border-[#C5EBDA] text-left hover:bg-[#E8F6EF] transition-colors cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-white text-[#1EA362] flex items-center justify-center mb-2 shadow-xs">
                  <Upload className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-[#0D2B4D]">Ajouter un document</div>
                <div className="text-[11px] text-[#5B6776]">Joindre un nouveau document</div>
              </Link>

              {/* Action 2 */}
              <Link
                href="/etudiant/messages"
                className="p-4 rounded-2xl bg-[#EBF3FA]/60 border border-[#D5E5F5] text-left hover:bg-[#EBF3FA] transition-colors cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-white text-[#3B82F6] flex items-center justify-center mb-2 shadow-xs">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-[#0D2B4D]">Contacter mon antenne</div>
                <div className="text-[11px] text-[#5B6776]">Poser une question</div>
              </Link>


              {/* Action 4 */}
              <Link
                href="/etudiant/stss"
                className="p-4 rounded-2xl bg-[#FBF6EA]/60 border border-[#F4E4BC] text-left hover:bg-[#FBF6EA] transition-colors cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-white text-[#C89C2E] flex items-center justify-center mb-2 shadow-xs">
                  <ArrowLeftRight className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-[#0D2B4D]">Suivre mon transfert STSS</div>
                 <div className="text-[11px] text-[#5B6776]">Consulter la simulation</div>
              </Link>
            </div>
          </div>

          {/* Notifications récentes */}
          <div className="bg-white rounded-3xl border border-[#E6E9EF] p-6 shadow-eap-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDF1F6]">
              <h4 className="text-sm font-bold text-[#0D2B4D]">Notifications récentes</h4>
              <Link
                href="/etudiant/notifications"
                className="text-xs font-semibold text-[#3B82F6] hover:underline cursor-pointer"
              >
                Voir tout →
              </Link>
            </div>

            <div className="space-y-3">
              {MOCK_NOTIFICATIONS.map((notif) => (
                <div key={notif.id} className="flex items-start gap-3">
                  <span
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      notif.type === "success"
                        ? "bg-[#1EA362]"
                        : notif.type === "warning"
                        ? "bg-[#F59E0B]"
                        : "bg-[#3B82F6]"
                    }`}
                  ></span>
                  <div>
                    <p className="text-xs text-[#0D2B4D] font-medium leading-snug">
                      {notif.title}
                    </p>
                    <span className="text-[10px] text-[#8E9BAA]">{notif.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ligne 3 : Ressources utiles & Carte d'illustration encouragement */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* 4 Ressources utiles (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <h3 className="text-sm font-bold text-[#0D2B4D]">Ressources utiles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/ressources" className="p-3.5 bg-white rounded-2xl border border-[#E6E9EF] shadow-xs flex items-center gap-3 hover:border-[#174A7C]/30 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-[#EBF3FA] text-[#3B82F6] flex items-center justify-center shrink-0">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#0D2B4D]">Guide étudiant</div>
                <div className="text-[10px] text-[#5B6776]">Consulter le guide</div>
              </div>
            </Link>

            <Link href="/a-propos" className="p-3.5 bg-white rounded-2xl border border-[#E6E9EF] shadow-xs flex items-center gap-3 hover:border-[#174A7C]/30 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-[#FEF7EC] text-[#F59E0B] flex items-center justify-center shrink-0">
                <ExternalLink className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#0D2B4D]">Présentation EA-POMRA</div>
                <div className="text-[10px] text-[#5B6776]">Découvrir la plateforme</div>
              </div>
            </Link>

            <Link href="/ressources#faq" className="p-3.5 bg-white rounded-2xl border border-[#E6E9EF] shadow-xs flex items-center gap-3 hover:border-[#174A7C]/30 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-[#E8F6EF] text-[#1EA362] flex items-center justify-center shrink-0">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#0D2B4D]">Questions fréquentes</div>
                <div className="text-[10px] text-[#5B6776]">Trouver des réponses</div>
              </div>
            </Link>

            <Link href="/contact" className="p-3.5 bg-white rounded-2xl border border-[#E6E9EF] shadow-xs flex items-center gap-3 hover:border-[#174A7C]/30 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-[#FBF6EA] text-[#C89C2E] flex items-center justify-center shrink-0">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#0D2B4D]">Nous écrire</div>
                <div className="text-[10px] text-[#5B6776]">Envoyer un message</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Carte Encouragement & Aide (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E6E9EF] p-6 shadow-eap-soft flex items-center justify-between gap-4">
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#0D2B4D]">
              Votre réussite, notre mission.
            </h4>
            <p className="text-xs text-[#5B6776] leading-relaxed">
              Nous sommes à vos côtés à chaque étape de votre parcours.
            </p>
            <Link
              href="/etudiant/aide"
              className="inline-block px-4 py-2 rounded-xl bg-[#1EA362] hover:bg-[#17824E] text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Besoin d&apos;aide ?
            </Link>
          </div>

          <div className="relative w-28 h-28 shrink-0">
            <Image
              src="/assets/logo-ea-pomra-round.png"
              alt="EA-POMRA Réussite"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
