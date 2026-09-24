import type { BackofficeScope } from "@/lib/backoffice-types";

export const DEMO_REFERENCE_DATE = new Date("2026-09-19T10:42:00.000Z");

export type PeriodReference = {
  year: number;
  quarter: number;
  label: string;
};

export function referenceDateForScope(scope: BackofficeScope, now = new Date()): Date {
  return scope.isDemo ? DEMO_REFERENCE_DATE : now;
}

export function currentPeriod(referenceDate: Date): PeriodReference {
  const year = referenceDate.getUTCFullYear();
  const quarter = Math.floor(referenceDate.getUTCMonth() / 3) + 1;
  return { year, quarter, label: `${quarter}e trimestre ${year}` };
}

export function previousPeriod(referenceDate: Date): PeriodReference {
  const quarter = currentPeriod(referenceDate).quarter;
  return quarter === 1
    ? { year: referenceDate.getUTCFullYear() - 1, quarter: 4, label: `4e trimestre ${referenceDate.getUTCFullYear() - 1}` }
    : { year: referenceDate.getUTCFullYear(), quarter: quarter - 1, label: `${quarter - 1}e trimestre ${referenceDate.getUTCFullYear()}` };
}

export function isTaskOverdue(dueAt: Date, now: Date, status: "OPEN" | "IN_PROGRESS" | "DONE" | "CANCELLED"): boolean {
  return (status === "OPEN" || status === "IN_PROGRESS") && dueAt.getTime() < now.getTime();
}
