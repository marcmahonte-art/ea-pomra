"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw } from "lucide-react";

/**
 * Frontière d'erreur du portail Parent.
 *
 * Un composant client est obligatoire ici : React n'appelle `reset()` que
 * depuis une frontière d'erreur. Le message affiché reste volontairement
 * générique — un espace nominatif ne doit pas exposer de trace technique au
 * navigateur — mais le code `digest` est reproduit pour permettre à l'équipe
 * de retrouver l'incident dans les journaux serveur.
 */
export default function ParentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[EA-POMRA] Erreur dans l'espace parent :", error);
  }, [error]);

  return (
    <div className="bg-white rounded-3xl border border-[#E6E9EF] shadow-eap-soft p-8 text-center space-y-4">
      <div className="w-12 h-12 rounded-full bg-[#FDECEC] text-[#D9383A] flex items-center justify-center mx-auto">
        <AlertCircle className="w-6 h-6" />
      </div>

      <div>
        <h1 className="text-lg font-bold text-[#0D2B4D]">
          Impossible d&apos;afficher cette section
        </h1>
        <p className="text-sm text-[#5B6776] mt-2 max-w-md mx-auto leading-relaxed">
          Une erreur est survenue pendant le chargement de votre dossier. Vos
          données ne sont pas affectées. Vous pouvez réessayer, puis contacter
          votre antenne si le problème persiste.
        </p>
      </div>

      {error.digest ? (
        <p className="text-[11px] text-[#8E9BAA] font-mono">
          Référence technique : {error.digest}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#174A7C] hover:bg-[#123B63] text-white text-sm font-semibold transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Réessayer
        </button>
        <Link
          href="/parent"
          className="inline-flex items-center px-4 py-2.5 rounded-xl bg-white border border-[#E6E9EF] hover:bg-[#F7F9FB] text-[#0D2B4D] text-sm font-semibold transition-colors"
        >
          Revenir au tableau de bord
        </Link>
      </div>
    </div>
  );
}
