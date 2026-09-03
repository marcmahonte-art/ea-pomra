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
  HeartHandshake,
  ArrowLeftRight,
  Download,
  ExternalLink,
  HelpCircle,
  Send,
} from "lucide-react";

export default function StudentDashboardPage() {
  return (
    <div className="space-y-8">
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
                CI-2024-00125
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
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#EBF7F0] text-[#1EA362] text-xs font-bold mt-1">
                En cours
              </span>
            </div>

            <div>
              <span className="text-[11px] text-[#8E9BAA] font-semibold block">
                Antenne
              </span>
              <span className="text-xs font-bold text-[#0D2B4D] mt-1 block">
                Côte d&apos;Ivoire
              </span>
            </div>

            <div>
              <span className="text-[11px] text-[#8E9BAA] font-semibold block">
                Date d&apos;inscription
              </span>
              <span className="text-xs font-bold text-[#0D2B4D] mt-1 block">
                12 Mars 2024
              </span>
            </div>

            <div>
              <span className="text-[11px] text-[#8E9BAA] font-semibold block">
                Programme visé
              </span>
              <span className="text-xs font-bold text-[#0D2B4D] mt-1 block">
                Licence en Informatique
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
              className="text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer"
            >
              Voir tout →
            </Link>
          </div>

          {/* Stepper horizontal avec 4 étapes */}
          <div className="grid grid-cols-4 gap-2 pt-3 text-center">
            {/* Étape 1 */}
            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-full bg-[#1EA362] text-white font-bold text-xs flex items-center justify-center mx-auto">
                1
              </div>
              <div className="text-[11px] font-bold text-[#0D2B4D] leading-tight">
                Dossier soumis
              </div>
              <div className="text-[10px] text-[#8E9BAA]">12/03/2024</div>
            </div>

            {/* Étape 2 */}
            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white font-bold text-xs flex items-center justify-center mx-auto ring-4 ring-[#EFF6FF]">
                2
              </div>
              <div className="text-[11px] font-bold text-[#0D2B4D] leading-tight">
                Étude OCO
              </div>
              <div className="text-[10px] text-[#2563EB] font-semibold">En cours</div>
            </div>

            {/* Étape 3 */}
            <div className="space-y-1.5 opacity-60">
              <div className="w-8 h-8 rounded-full bg-[#E6E9EF] text-[#8E9BAA] font-bold text-xs flex items-center justify-center mx-auto">
                3
              </div>
              <div className="text-[11px] font-bold text-[#0D2B4D] leading-tight">
                Orientation
              </div>
              <div className="text-[10px] text-[#8E9BAA]">À venir</div>
            </div>

            {/* Étape 4 */}
            <div className="space-y-1.5 opacity-60">
              <div className="w-8 h-8 rounded-full bg-[#E6E9EF] text-[#8E9BAA] font-bold text-xs flex items-center justify-center mx-auto">
                4
              </div>
              <div className="text-[11px] font-bold text-[#0D2B4D] leading-tight">
                Décision finale
              </div>
              <div className="text-[10px] text-[#8E9BAA]">À venir</div>
            </div>
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
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                <Folder className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-black text-[#0D2B4D]">7</div>
                <div className="text-[10px] text-[#5B6776]">Documents soumis</div>
              </div>
            </Link>

            {/* Stat 2 */}
            <Link href="/etudiant/dossier" className="bg-white p-4 rounded-2xl border border-[#E6E9EF] shadow-xs flex items-center gap-3 hover:border-[#1EA362]/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#EBF7F0] text-[#1EA362] flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-black text-[#0D2B4D]">2</div>
                <div className="text-[10px] text-[#5B6776]">Étapes terminées</div>
              </div>
            </Link>

            {/* Stat 3 */}
            <Link href="/etudiant/orientation" className="bg-white p-4 rounded-2xl border border-[#E6E9EF] shadow-xs flex items-center gap-3 hover:border-[#D97706]/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
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
              {/* Item 1 */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#EDF1F6]">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#1EA362] text-white flex items-center justify-center mt-0.5 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0D2B4D]">
                      Dossier de candidature soumis
                    </div>
                    <div className="text-[11px] text-[#8E9BAA]">12 Mars 2024 à 14:30</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EBF7F0] text-[#1EA362]">
                  Terminé
                </span>
              </div>

              {/* Item 2 */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#EDF1F6]">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#2563EB] text-white font-bold text-xs flex items-center justify-center mt-0.5 shrink-0">
                    2
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0D2B4D]">
                      Étude par l&apos;Expert OCO
                    </div>
                    <div className="text-[11px] text-[#5B6776]">
                      Votre dossier est en cours d&apos;analyse par l&apos;expert OCO.
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB]">
                  En cours
                </span>
              </div>

              {/* Item 3 */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#EDF1F6] opacity-60">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#E6E9EF] text-[#8E9BAA] font-bold text-xs flex items-center justify-center mt-0.5 shrink-0">
                    3
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0D2B4D]">
                      Orientation proposée
                    </div>
                    <div className="text-[11px] text-[#8E9BAA]">
                      Orientation académique et établissement recommandé.
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F7F9FB] text-[#8E9BAA]">
                  À venir
                </span>
              </div>

              {/* Item 4 */}
              <div className="flex items-start justify-between gap-3 opacity-60">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#E6E9EF] text-[#8E9BAA] font-bold text-xs flex items-center justify-center mt-0.5 shrink-0">
                    4
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0D2B4D]">
                      Décision finale BEC
                    </div>
                    <div className="text-[11px] text-[#8E9BAA]">
                      Validation finale et communication de la décision.
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F7F9FB] text-[#8E9BAA]">
                  À venir
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/etudiant/dossier"
                className="text-xs font-bold text-[#2563EB] hover:underline inline-flex items-center gap-1 cursor-pointer"
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
                className="p-4 rounded-2xl bg-[#EBF7F0]/60 border border-[#C5EBDA] text-left hover:bg-[#EBF7F0] transition-colors cursor-pointer group"
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
                className="p-4 rounded-2xl bg-[#EFF6FF]/60 border border-[#BFDBFE] text-left hover:bg-[#EFF6FF] transition-colors cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-white text-[#2563EB] flex items-center justify-center mb-2 shadow-xs">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-[#0D2B4D]">Contacter mon antenne</div>
                <div className="text-[11px] text-[#5B6776]">Poser une question</div>
              </Link>

              {/* Action 3 */}
              <Link
                href="/etudiant/pap"
                className="p-4 rounded-2xl bg-[#FEF3C7]/60 border border-[#FDE68A] text-left hover:bg-[#FEF3C7] transition-colors cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-white text-[#D97706] flex items-center justify-center mb-2 shadow-xs">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-[#0D2B4D]">Demander un accompagnement PAP</div>
                <div className="text-[11px] text-[#5B6776]">Être accompagné</div>
              </Link>

              {/* Action 4 */}
              <Link
                href="/etudiant/stss"
                className="p-4 rounded-2xl bg-[#F3E8FF]/60 border border-[#DDD6FE] text-left hover:bg-[#F3E8FF] transition-colors cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-white text-[#7C3AED] flex items-center justify-center mb-2 shadow-xs">
                  <ArrowLeftRight className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-[#0D2B4D]">Demander un transfert STSS</div>
                <div className="text-[11px] text-[#5B6776]">Effectuer une demande</div>
              </Link>
            </div>
          </div>

          {/* Notifications récentes */}
          <div className="bg-white rounded-3xl border border-[#E6E9EF] p-6 shadow-eap-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDF1F6]">
              <h4 className="text-sm font-bold text-[#0D2B4D]">Notifications récentes</h4>
              <Link
                href="/etudiant/notifications"
                className="text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer"
              >
                Voir tout →
              </Link>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#2563EB] mt-1.5 shrink-0"></span>
                <div>
                  <p className="text-xs text-[#0D2B4D] font-medium leading-snug">
                    Votre dossier est en cours d&apos;étude par l&apos;expert OCO.
                  </p>
                  <span className="text-[10px] text-[#8E9BAA]">Il y a 2 heures</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#1EA362] mt-1.5 shrink-0"></span>
                <div>
                  <p className="text-xs text-[#0D2B4D] font-medium leading-snug">
                    Document &quot;Relevé de notes&quot; approuvé.
                  </p>
                  <span className="text-[10px] text-[#8E9BAA]">Il y a 1 jour</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#D97706] mt-1.5 shrink-0"></span>
                <div>
                  <p className="text-xs text-[#0D2B4D] font-medium leading-snug">
                    Nouveau message de votre antenne.
                  </p>
                  <span className="text-[10px] text-[#8E9BAA]">Il y a 2 jours</span>
                </div>
              </div>
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
            <div className="p-3.5 bg-white rounded-2xl border border-[#E6E9EF] shadow-xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#0D2B4D]">Guide étudiant</div>
                <div className="text-[10px] text-[#5B6776]">Télécharger le guide</div>
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border border-[#E6E9EF] shadow-xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
                <ExternalLink className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#0D2B4D]">Présentation EA-POMRA</div>
                <div className="text-[10px] text-[#5B6776]">Découvrir la plateforme</div>
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border border-[#E6E9EF] shadow-xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#EBF7F0] text-[#1EA362] flex items-center justify-center shrink-0">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#0D2B4D]">Questions fréquentes</div>
                <div className="text-[10px] text-[#5B6776]">Trouver des réponses</div>
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border border-[#E6E9EF] shadow-xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F3E8FF] text-[#7C3AED] flex items-center justify-center shrink-0">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#0D2B4D]">Nous écrire</div>
                <div className="text-[10px] text-[#5B6776]">Envoyer un message</div>
              </div>
            </div>
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
