import { Card } from "@/components/ui/Card";

/**
 * Squelettes de chargement (spec §31).
 *
 * Chaque squelette reprend la **structure finale** de l'écran qu'il remplace :
 * même nombre de cartes, même hauteur de lignes, mêmes colonnes. Un squelette
 * générique produit un saut de mise en page au moment où les données arrivent,
 * ce qui est plus déstabilisant qu'une attente franche — et c'est précisément
 * ce que la spec cherche à éviter sur les connexions faibles.
 */

function Bar({ className = "" }: { className?: string }) {
  return <div className={`rounded-full bg-[#EDF1F6] animate-pulse ${className}`} />;
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <div className="space-y-2">
        <Bar className="h-7 w-64" />
        <Bar className="h-4 w-80" />
      </div>

      {/* 4 cartes KPI, comme la grille réelle */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="p-5 space-y-3">
            <Bar className="h-3 w-24" />
            <Bar className="h-8 w-20" />
            <Bar className="h-3 w-32" />
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 p-5 space-y-4">
          <Bar className="h-4 w-48" />
          {Array.from({ length: 5 }).map((_, index) => (
            <Bar key={index} className="h-10 w-full" />
          ))}
        </Card>
        <Card className="p-5 space-y-4">
          <Bar className="h-4 w-32" />
          {Array.from({ length: 4 }).map((_, index) => (
            <Bar key={index} className="h-14 w-full" />
          ))}
        </Card>
      </div>
    </div>
  );
}

export function DossierTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <Card className="p-5 space-y-3" aria-busy="true" aria-live="polite">
      <Bar className="h-4 w-56" />
      <Bar className="h-11 w-full" />
      {Array.from({ length: rows }).map((_, index) => (
        <Bar key={index} className="h-16 w-full" />
      ))}
    </Card>
  );
}

export function DossierDetailSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <div className="space-y-2">
        <Bar className="h-4 w-40" />
        <Bar className="h-7 w-72" />
      </div>
      <Card className="p-5 space-y-4">
        <Bar className="h-4 w-32" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Bar className="h-3 w-20" />
              <Bar className="h-4 w-32" />
            </div>
          ))}
        </div>
      </Card>
      <DossierTableSkeleton rows={5} />
    </div>
  );
}

export function StatisticsSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="p-5 space-y-3">
            <Bar className="h-3 w-24" />
            <Bar className="h-8 w-16" />
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="p-5 space-y-3">
            <Bar className="h-4 w-40" />
            {Array.from({ length: 5 }).map((__, row) => (
              <Bar key={row} className="h-6 w-full" />
            ))}
          </Card>
        ))}
      </div>
    </div>
  );
}
