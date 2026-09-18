/**
 * État de chargement du portail Parent.
 *
 * Next.js affiche ce composant pendant que la page serveur se prépare. Il
 * reprend la silhouette du tableau de bord — bandeau, indicateurs, cartes — pour
 * que l'arrivée du contenu ne provoque pas de saut visuel.
 */
export default function ParentLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <span className="sr-only">Chargement du contenu en cours…</span>

      {/* Titre */}
      <div className="space-y-2">
        <div className="h-7 w-56 rounded-lg bg-[#E6E9EF] animate-pulse" />
        <div className="h-4 w-80 rounded bg-[#EDF1F6] animate-pulse" />
      </div>

      {/* Bandeau d'action */}
      <div className="h-24 rounded-2xl bg-[#EDF1F6] animate-pulse" />

      {/* Indicateurs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className="h-24 rounded-2xl bg-white border border-[#E6E9EF] animate-pulse"
          />
        ))}
      </div>

      {/* Carte d'identité */}
      <div className="h-56 rounded-3xl bg-white border border-[#E6E9EF] animate-pulse" />

      {/* Deux colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 h-48 rounded-3xl bg-white border border-[#E6E9EF] animate-pulse" />
        <div className="lg:col-span-5 h-48 rounded-3xl bg-white border border-[#E6E9EF] animate-pulse" />
      </div>
    </div>
  );
}
