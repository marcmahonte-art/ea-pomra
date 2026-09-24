export function PapKpiGrid({ values }: { values: { activeAlerts: number; followUpsInProgress: number; activeMentorats: number; recentInterventions: number } }) {
  const items = [
    ["Alertes actives", values.activeAlerts],
    ["Suivis en cours", values.followUpsInProgress],
    ["Mentorats actifs", values.activeMentorats],
    ["Interventions récentes", values.recentInterventions]
  ] as const;
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{items.map(([label, value]) => <article key={label} className="rounded-2xl border border-[#E6E9EF] bg-white p-5 shadow-eap-soft"><p className="text-[11px] font-bold uppercase tracking-wider text-[#667085]">{label}</p><p className="mt-3 text-3xl font-extrabold text-[#0D2B4D]">{value}</p><p className="mt-2 text-[11px] text-[#98A2B3]">Données de votre périmètre</p></article>)}</div>;
}
