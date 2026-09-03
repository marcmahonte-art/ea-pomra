"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FileText, Upload, CheckCircle2, Clock, Download, Plus, Trash2 } from "lucide-react";

export default function MesDocumentsPage() {
  const [docs, setDocs] = useState([
    { id: 1, name: "Passeport biométrique (validité > 6 mois)", type: "Identité", status: "Validé", date: "12/03/2024", size: "2.4 Mo" },
    { id: 2, name: "Diplôme du Baccalauréat & Relevé officiel", type: "Diplôme", status: "Validé", date: "12/03/2024", size: "3.1 Mo" },
    { id: 3, name: "Bulletins de notes de Seconde, Première et Terminale", type: "Académique", status: "Validé", date: "12/03/2024", size: "5.8 Mo" },
    { id: 4, name: "Quittance officielle de scolarité STSS", type: "Financier", status: "Validé", date: "14/03/2024", size: "1.2 Mo" },
    { id: 5, name: "Certificat médical d'aptitude physique", type: "Santé", status: "Validé", date: "13/03/2024", size: "850 Ko" },
    { id: 6, name: "Fiche d'engagement parental légalisée", type: "Famille", status: "Validé", date: "12/03/2024", size: "1.5 Mo" },
    { id: 7, name: "Attestation de pré-inscription universitaire", type: "Admission", status: "En cours", date: "15/03/2024", size: "1.1 Mo" },
  ]);

  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDocs([
        ...docs,
        {
          id: Date.now(),
          name: file.name,
          type: "Complémentaire",
          status: "En cours",
          date: "Aujourd'hui",
          size: (file.size / 1024 / 1024).toFixed(1) + " Mo",
        },
      ]);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Page */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E9EF]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#5B6776] mb-1">
            <Link href="/etudiant/dashboard" className="hover:text-[#0D2B4D]">Espace Étudiant</Link>
            <span>/</span>
            <span className="text-[#174A7C] font-semibold">Mes documents</span>
          </div>
          <h1 className="text-2xl font-black text-[#0D2B4D] tracking-tight flex items-center gap-3">
            <FileText className="w-6 h-6 text-[#174A7C]" />
            Pièces Justificatives & Documents (7/7)
          </h1>
        </div>

        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#174A7C] hover:bg-[#123B63] text-white text-xs font-bold transition-all shadow-xs cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>Ajouter un document</span>
          <input type="file" className="hidden" onChange={handleSimulatedUpload} />
        </label>
      </div>

      {uploadSuccess && (
        <div className="p-4 bg-[#EBF7F0] border border-[#C5EBDA] text-[#1EA362] rounded-2xl text-xs font-bold flex items-center justify-between">
          <span>✅ Document téléversé avec succès ! Il a été transmis à votre antenne pour vérification.</span>
        </div>
      )}

      {/* Zone de glisser-déposer */}
      <div className="border-2 border-dashed border-[#CBD5E1] rounded-3xl p-6 text-center bg-white hover:border-[#174A7C] transition-colors">
        <Upload className="w-8 h-8 text-[#174A7C] mx-auto mb-2" />
        <p className="text-sm font-bold text-[#0D2B4D]">Glissez-déposez vos nouveaux justificatifs ici</p>
        <p className="text-xs text-[#8E9BAA] mt-1">Formats acceptés : PDF, JPG, PNG (Max 10 Mo par fichier)</p>
      </div>

      {/* Liste des documents */}
      <div className="bg-white rounded-3xl border border-[#E6E9EF] p-6 sm:p-8 shadow-eap-soft space-y-4">
        <h2 className="text-base font-bold text-[#0D2B4D]">Documents de votre dossier de mobilité</h2>

        <div className="divide-y divide-[#EDF1F6]">
          {docs.map((doc) => (
            <div key={doc.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#0D2B4D]">{doc.name}</h3>
                  <div className="flex items-center gap-2 text-[11px] text-[#8E9BAA] mt-0.5">
                    <span>{doc.type}</span>
                    <span>•</span>
                    <span>{doc.size}</span>
                    <span>•</span>
                    <span>Déposé le {doc.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    doc.status === "Validé"
                      ? "bg-[#EBF7F0] text-[#1EA362]"
                      : "bg-[#EFF6FF] text-[#2563EB]"
                  }`}
                >
                  {doc.status}
                </span>

                <button
                  onClick={() => alert(`Téléchargement de : ${doc.name}`)}
                  className="p-2 rounded-xl text-[#5B6776] hover:text-[#0D2B4D] hover:bg-[#F0F5FA] transition-colors cursor-pointer"
                  title="Télécharger"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
