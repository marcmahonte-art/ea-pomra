"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

/**
 * État d'erreur du back-office (spec §31).
 *
 * « Ne jamais afficher les détails techniques sensibles au simple
 * utilisateur. » Le message de l'exception n'est donc pas rendu : il est
 * journalisé côté client pour le support, et l'utilisateur ne reçoit qu'une
 * phrase et une action.
 *
 * `digest` est l'identifiant que Next.js attribue à l'erreur côté serveur. Il
 * est assez court pour être recopié dans un ticket et ne contient aucune donnée
 * métier — c'est le seul détail technique qui franchit cette frontière.
 */
export function BackofficeError({
  error,
  reset,
  title = "Une erreur est survenue.",
}: {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
}) {
  useEffect(() => {
    console.error("[EA-POMRA] Erreur back-office :", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-16 rounded-2xl border border-[#FAC6C6] bg-[#FEF7F7]">
      <div className="w-12 h-12 rounded-full bg-[#FDECEC] text-[#B42318] flex items-center justify-center mb-4">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h2 className="text-base font-bold text-[#0D2B4D]">{title}</h2>
      <p className="text-sm text-[#5B6776] mt-1 max-w-md leading-relaxed">
        Veuillez réessayer. Si le problème persiste, transmettez la référence
        ci-dessous au support.
      </p>
      {error.digest ? (
        <p className="mt-3 text-[11px] font-mono text-[#98A2B3]">
          Référence : {error.digest}
        </p>
      ) : null}
      <button
        type="button"
        onClick={reset}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#174A7C] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#0D2B4D] transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Réessayer
      </button>
    </div>
  );
}

export default BackofficeError;
