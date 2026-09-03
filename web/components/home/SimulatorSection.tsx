"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Calculator, ArrowRight, ShieldCheck, Clock, CheckCircle2, Building2 } from "lucide-react";
import { ANTENNES_EA_POMRA } from "@/lib/data";

export function SimulatorSection() {
  const [originCountry, setOriginCountry] = useState("Sénégal");
  const [targetCountry, setTargetCountry] = useState("Côte d'Ivoire");
  const [studyField, setStudyField] = useState("Informatique & Intelligence Artificielle");
  const [studyLevel, setStudyLevel] = useState("Master");

  const [simulationCalculated, setSimulationCalculated] = useState(true);

  return (
    <section id="simulateur" className="py-20 bg-white border-b border-[#E6E9EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <Badge variant="primary" size="md">
            Simulateur Gratuit & Sans Engagement
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D2B4D] tracking-tight">
            Estimez votre parcours de mobilité en 30 secondes
          </h2>
          <p className="text-base sm:text-lg text-[#5B6776]">
            Configurez votre départ et découvrez la prise en charge offerte par les antennes EA-POMRA pour votre filière.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Formulaire de configuration */}
          <Card className="lg:col-span-6 border-[#E6E9EF] shadow-eap-soft flex flex-col justify-between">
            <CardContent className="p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-2 pb-4 border-b border-[#EDF1F6]">
                <Calculator className="w-5 h-5 text-[#174A7C]" />
                <h3 className="font-bold text-lg text-[#0D2B4D]">
                  Paramètres de votre projet
                </h3>
              </div>

              {/* Pays d'origine */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0D2B4D] uppercase tracking-wider">
                  Pays de résidence actuel (Famille)
                </label>
                <select
                  value={originCountry}
                  onChange={(e) => setOriginCountry(e.target.value)}
                  aria-label="Pays de résidence actuel (Famille)"
                  className="w-full bg-[#F7F9FB] border border-[#E6E9EF] rounded-xl px-3.5 py-2.5 text-sm font-semibold text-[#0D2B4D] focus:outline-none focus:border-[#174A7C]"
                >
                  {ANTENNES_EA_POMRA.map((a) => (
                    <option key={a.code} value={a.country}>
                      {a.flag} {a.country}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pays de destination */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0D2B4D] uppercase tracking-wider">
                  Pays d&apos;accueil souhaité pour les études
                </label>
                <select
                  value={targetCountry}
                  onChange={(e) => setTargetCountry(e.target.value)}
                  aria-label="Pays d'accueil souhaité pour les études"
                  className="w-full bg-[#F7F9FB] border border-[#E6E9EF] rounded-xl px-3.5 py-2.5 text-sm font-semibold text-[#0D2B4D] focus:outline-none focus:border-[#174A7C]"
                >
                  {ANTENNES_EA_POMRA.map((a) => (
                    <option key={a.code} value={a.country}>
                      {a.flag} {a.country}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filière */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0D2B4D] uppercase tracking-wider">
                  Filière envisagée
                </label>
                <select
                  value={studyField}
                  onChange={(e) => setStudyField(e.target.value)}
                  aria-label="Filière envisagée"
                  className="w-full bg-[#F7F9FB] border border-[#E6E9EF] rounded-xl px-3.5 py-2.5 text-sm font-semibold text-[#0D2B4D] focus:outline-none focus:border-[#174A7C]"
                >
                  <option value="Informatique & Intelligence Artificielle">Informatique & Intelligence Artificielle</option>
                  <option value="Sciences Économiques & Finance de Marché">Sciences Économiques & Finance</option>
                  <option value="Droit des Affaires & Fiscalité OHADA">Droit des Affaires & OHADA</option>
                  <option value="Génie Civil & Énergies Renouvelables">Génie Civil & Énergies Renouvelables</option>
                  <option value="Santé Publique & Pharmacie">Santé Publique & Pharmacie</option>
                  <option value="Agronomie & Agro-industrie">Agronomie & Agro-industrie</option>
                </select>
              </div>

              {/* Niveau */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0D2B4D] uppercase tracking-wider">
                  Niveau d&apos;admission
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Licence", "Master", "Doctorat"].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setStudyLevel(lvl)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        studyLevel === lvl
                          ? "bg-[#174A7C] text-white"
                          : "bg-[#F0F5FA] text-[#0D2B4D] hover:bg-[#E6E9EF]"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Résultat de la simulation */}
          <Card className="lg:col-span-6 bg-gradient-to-br from-[#0D2B4D] to-[#174A7C] text-white border-0 shadow-eap-card flex flex-col justify-between">
            <CardContent className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-white/15">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">✈️</span>
                    <span className="font-bold text-sm tracking-wide text-[#F7D070]">
                      Mobilité {originCountry} ➡️ {targetCountry}
                    </span>
                  </div>
                  <Badge variant="gold" size="sm">
                    {studyLevel}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <h4 className="text-2xl font-black text-white leading-snug">
                    Parcours 100% éligible à l&apos;encadrement EA-POMRA
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Votre cursus en <strong className="text-white">{studyField}</strong> bénéficie d&apos;universités partenaires homologuées et de l&apos;accueil par l&apos;antenne {targetCountry}.
                  </p>
                </div>

                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center gap-2.5 text-xs text-slate-200">
                    <Clock className="w-4 h-4 text-[#F7D070] shrink-0" />
                    <span>Délai d&apos;évaluation OCO : <strong>72 heures max</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-200">
                    <ShieldCheck className="w-4 h-4 text-[#1EA362] shrink-0" />
                    <span>Sécurisation STSS : <strong>Dépôt en monnaie locale</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-[#1EA362] shrink-0" />
                    <span>Pôle PAP : <strong>Tuteur d&apos;accueil dédié à l&apos;arrivée</strong></span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/15 space-y-3">
                <Button
                  variant="gold"
                  className="w-full font-bold text-sm shadow-md"
                  onClick={() => alert(`Demande initiée pour la mobilité ${originCountry} -> ${targetCountry}. Vous allez être redirigé vers l'espace étudiant.`)}
                >
                  <span>Initier mon dossier de mobilité</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
                <p className="text-[11px] text-center text-slate-400">
                  Attribution immédiate d&apos;un code sécurisé ID-POMRA.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
