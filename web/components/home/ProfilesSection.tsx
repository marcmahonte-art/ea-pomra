"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { GraduationCap, Users, Building2, CheckCircle2, ArrowRight, ShieldCheck, HeartHandshake } from "lucide-react";

export function ProfilesSection() {
  const [activeTab, setActiveTab] = useState<"student" | "parent" | "partner">("student");

  const profiles = {
    student: {
      icon: GraduationCap,
      badge: "Espace Candidat & Étudiant",
      tagline: "« Étudier loin de chez soi, sans jamais se sentir seul. »",
      title: "Construisez votre parcours en toute sérénité",
      desc: "De la sélection de votre université d'accueil jusqu'au diplôme, bénéficiez d'un identifiant confidentiel ID-POMRA, d'un encadrement par des aînés et de la garantie que votre scolarité est acquittée dans les règles de l'art.",
      points: [
        "Orientation personnalisée selon vos bulletins et vos ambitions professionnelles",
        "Prise en charge dès la descente d'avion par l'antenne locale",
        "Accès 24/7 au canal d'écoute confidentiel PAP (santé, hébergement, intégration)",
        "Dépôt numérique des pièces et suivi du dossier en temps réel",
      ],
      ctaText: "Ouvrir mon Espace Étudiant",
      ctaHref: "/etudiant/dashboard",
      accentColor: "#174A7C",
      lightBg: "#EBF3FA",
    },
    parent: {
      icon: Users,
      badge: "Espace Parents & Tuteurs",
      tagline: "« Votre enfant étudie loin. Vous, restez proche. »",
      title: "Suivez son parcours, pas seulement ses résultats",
      desc: "L'éloignement d'un enfant est une source légitime d'inquiétude. EA-POMRA vous permet de verser la scolarité en monnaie locale auprès de votre antenne nationale avec une garantie bancaire certifiée et de recevoir des rapports trimestriels sur son assiduité et son bien-être.",
      points: [
        "Garantie STSS : Quittance officielle délivrée avant le départ pour éviter les arnaques",
        "Rapports de suivi trimestriels réguliers rédigés avec les tuteurs de l'antenne",
        "Point focal d'urgence joignable 7j/7 dans la ville où réside votre enfant",
        "Paiement fractionné possible selon les accords avec l'université d'accueil",
      ],
      ctaText: "Découvrir le suivi Espace Parent",
      ctaHref: "/etudiant/dashboard",
      accentColor: "#C89C2E",
      lightBg: "#FBF6EA",
    },
    partner: {
      icon: Building2,
      badge: "Universités & Institutions Partenaires",
      tagline: "« Des étudiants préparés, des scolarités garanties à 100%. »",
      title: "Un vivier de talents africains encadrés",
      desc: "Pour les grandes écoles et universités d'Afrique, EA-POMRA est le garant de la régularité des candidatures : vérification des diplômes préalables, paiement sécurisé des frais de scolarité via nos trésoriers nationaux et accompagnement civique des étudiants.",
      points: [
        "Vérification rigoureuse des diplômes d'origine via nos 8 antennes",
        "Paiement direct et groupé des droits d'inscription sans retard",
        "Réduction drastique du taux d'abandon grâce au suivi psychosocial PAP",
        "Conventionnement bilatéral favorisant le rayonnement panafricain",
      ],
      ctaText: "Devenir établissement partenaire",
      ctaHref: "#contact",
      accentColor: "#1EA362",
      lightBg: "#E8F6EF",
    },
  };

  const current = profiles[activeTab];
  const Icon = current.icon;

  return (
    <section id="espaces" className="py-20 bg-white border-b border-[#E6E9EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <Badge variant="primary" size="md">
            Parcours Sur-Mesure
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D2B4D] tracking-tight">
            Un écosystème conçu pour chaque partie prenante
          </h2>
          <p className="text-base sm:text-lg text-[#5B6776]">
            Que vous soyez étudiant en quête d&apos;avenir, parent attentif ou université d&apos;excellence, découvrez comment EA-POMRA répond à vos besoins spécifiques.
          </p>
        </div>

        {/* Tabs de sélection */}
        <div className="flex justify-center mb-10">
          <div className="bg-[#F0F5FA] p-1.5 rounded-2xl inline-flex gap-2 border border-[#E6E9EF]">
            <button
              onClick={() => setActiveTab("student")}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activeTab === "student"
                  ? "bg-white text-[#174A7C] shadow-eap-soft"
                  : "text-[#5B6776] hover:text-[#0D2B4D]"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Pour l&apos;Étudiant</span>
            </button>

            <button
              onClick={() => setActiveTab("parent")}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activeTab === "parent"
                  ? "bg-white text-[#C89C2E] shadow-eap-soft"
                  : "text-[#5B6776] hover:text-[#0D2B4D]"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Pour la Famille</span>
            </button>

            <button
              onClick={() => setActiveTab("partner")}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activeTab === "partner"
                  ? "bg-white text-[#1EA362] shadow-eap-soft"
                  : "text-[#5B6776] hover:text-[#0D2B4D]"
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Pour les Universités</span>
            </button>
          </div>
        </div>

        {/* Contenu de la fiche active */}
        <div className="max-w-4xl mx-auto">
          <Card className="border border-[#E6E9EF] shadow-eap-card">
            <CardContent className="p-8 sm:p-12 space-y-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#EDF1F6]">
                <div>
                  <Badge
                    className="mb-2"
                    style={{ backgroundColor: current.lightBg, color: current.accentColor }}
                  >
                    {current.badge}
                  </Badge>
                  <p className="text-sm font-semibold italic text-[#5B6776]">
                    {current.tagline}
                  </p>
                </div>
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: current.lightBg }}
                >
                  <Icon className="w-8 h-8" style={{ color: current.accentColor }} />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl sm:text-3xl font-black text-[#0D2B4D]">
                  {current.title}
                </h3>
                <p className="text-base text-[#5B6776] leading-relaxed">
                  {current.desc}
                </p>
              </div>

              {/* Points forts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {current.points.map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-[#F7F9FB] p-3.5 rounded-xl border border-[#EDF1F6]">
                    <CheckCircle2 className="w-5 h-5 text-[#1EA362] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-medium text-[#0D2B4D]">
                      {pt}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bouton d'action */}
              <div className="pt-6 border-t border-[#EDF1F6] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-[#5B6776]">
                  <ShieldCheck className="w-4 h-4 text-[#1EA362]" />
                  <span>Cadre officiel d&apos;accompagnement EA-POMRA</span>
                </div>
                <Link href={current.ctaHref} className="w-full sm:w-auto">
                  <Button
                    size="md"
                    className="w-full sm:w-auto font-bold gap-2"
                    style={{ backgroundColor: current.accentColor }}
                  >
                    <span>{current.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
