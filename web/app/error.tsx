"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, Home } from "lucide-react";

/**
 * Frontière d'erreur du site.
 *
 * Sans ce fichier, toute exception non rattrapée affiche l'écran d'erreur par
 * défaut de Next.js — en anglais, sans identité de marque. Le composant doit
 * être un composant client : Next.js lui fournit `reset` pour retenter le rendu
 * sans recharger la page.
 *
 * `digest` est un identifiant généré par le serveur : il ne contient pas le
 * message d'erreur (qui pourrait exposer des données internes) mais permet de
 * retrouver l'incident dans les journaux. On l'affiche donc tel quel.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erreur non rattrapée :", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#F7F9FB] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md text-center">
        <h1 className="text-xl font-bold text-[#0D2B4D]">
          Une erreur est survenue
        </h1>
        <p className="text-sm text-[#5B6776] mt-2 leading-relaxed">
          Cette section n&apos;a pas pu s&apos;afficher. Vous pouvez réessayer ;
          si le problème persiste, contactez votre antenne nationale.
        </p>

        {error.digest && (
          <p className="mt-4 text-[11px] text-[#8E9BAA] font-mono">
            Référence : {error.digest}
          </p>
        )}

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#174A7C] hover:bg-[#123B63] text-white text-sm font-bold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Réessayer
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-[#E6E9EF] hover:border-[#174A7C] text-[#0D2B4D] text-sm font-bold transition-colors"
          >
            <Home className="w-4 h-4" />
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </main>
  );
}
