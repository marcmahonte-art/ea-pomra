import type { StssStatus } from "@/lib/stss-types";

const ALLOWED_TRANSITIONS: Record<StssStatus, readonly StssStatus[]> = {
  DRAFT: ["PENDING_KYC", "CANCELLED", "SIMULATION"],
  PENDING_KYC: ["PENDING_PAYMENT", "FAILED", "CANCELLED", "SIMULATION"],
  PENDING_PAYMENT: ["PAYMENT_CONFIRMED", "FAILED", "CANCELLED", "SIMULATION"],
  PAYMENT_CONFIRMED: ["TRANSFER_PENDING", "FAILED", "CANCELLED", "SIMULATION"],
  TRANSFER_PENDING: ["TRANSFER_CONFIRMED", "FAILED", "CANCELLED", "SIMULATION"],
  TRANSFER_CONFIRMED: [],
  FAILED: [],
  CANCELLED: [],
  SIMULATION: []
};

export interface StssAmounts {
  grossAmountMinor: number;
  netAmountMinor: number;
  commissionAmountMinor: number;
}

export function isTerminalStssStatus(status: StssStatus): boolean {
  return ALLOWED_TRANSITIONS[status].length === 0;
}

export function validateCommissionRateBps(rateBps: number): void {
  if (!Number.isInteger(rateBps) || rateBps < 0 || rateBps > 300) {
    throw new Error("commission_rate_bps must be an integer between 0 and 300");
  }
}

export function calculateStssAmounts(
  grossAmountMinor: number,
  commissionRateBps: number
): StssAmounts {
  if (!Number.isSafeInteger(grossAmountMinor) || grossAmountMinor <= 0) {
    throw new Error("grossAmountMinor must be a positive safe integer");
  }
  validateCommissionRateBps(commissionRateBps);
  const quotient = Math.floor(grossAmountMinor / 10000);
  const remainder = grossAmountMinor % 10000;
  const commissionAmountMinor =
    quotient * commissionRateBps + Math.floor((remainder * commissionRateBps + 5000) / 10000);
  const netAmountMinor = grossAmountMinor - commissionAmountMinor;
  const amounts = { grossAmountMinor, netAmountMinor, commissionAmountMinor };
  assertStssAmounts(amounts);
  return amounts;
}

export function assertStssAmounts(amounts: StssAmounts): void {
  const values = [
    amounts.grossAmountMinor,
    amounts.netAmountMinor,
    amounts.commissionAmountMinor
  ];
  if (!values.every((value) => Number.isSafeInteger(value) && value >= 0)) {
    throw new Error("STSS amounts must be non-negative safe integers");
  }
  if (amounts.grossAmountMinor <= 0) {
    throw new Error("grossAmountMinor must be positive");
  }
  if (amounts.grossAmountMinor !== amounts.netAmountMinor + amounts.commissionAmountMinor) {
    throw new Error("gross amount must equal net amount plus commission");
  }
}

export function assertDifferentAntennas(source: string, destination: string): void {
  if (!source.trim() || !destination.trim() || source.trim() === destination.trim()) {
    throw new Error("source and destination must be different non-empty antennas");
  }
}

export function transitionStssStatus(current: StssStatus, next: StssStatus): StssStatus {
  if (isTerminalStssStatus(current)) {
    throw new Error("terminal STSS status is immutable");
  }
  if (!ALLOWED_TRANSITIONS[current].includes(next)) {
    throw new Error(`invalid STSS transition: ${current} -> ${next}`);
  }
  return next;
}

export function getAllowedStssTransitions(current: StssStatus): readonly StssStatus[] {
  return ALLOWED_TRANSITIONS[current];
}
