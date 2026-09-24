export const STSS_STATUSES = [
  "DRAFT",
  "PENDING_KYC",
  "PENDING_PAYMENT",
  "PAYMENT_CONFIRMED",
  "TRANSFER_PENDING",
  "TRANSFER_CONFIRMED",
  "FAILED",
  "CANCELLED",
  "SIMULATION"
] as const;

export type StssStatus = (typeof STSS_STATUSES)[number];

export const STSS_CURRENCIES = ["FCFA", "XAF", "USD", "EUR", "CAD"] as const;
export type StssCurrency = (typeof STSS_CURRENCIES)[number];

export const STSS_COUNTRIES = [
  { code: "SN", name: "Sénégal", flag: "🇸🇳" },
  { code: "CI", name: "Côte d'Ivoire", flag: "🇨🇮" },
  { code: "CM", name: "Cameroun", flag: "🇨🇲" },
  { code: "GA", name: "Gabon", flag: "🇬🇦" },
  { code: "BJ", name: "Bénin", flag: "🇧🇯" },
  { code: "TG", name: "Togo", flag: "🇹🇬" },
  { code: "CG", name: "Congo", flag: "🇨🇬" },
  { code: "CD", name: "RD Congo", flag: "🇨🇩" }
] as const;

export interface StssTransfer {
  id: string;
  dossierId: string | null;
  dossierReference: string | null;
  reference: string;
  idempotencyKey: string;
  sourceAntennaId: string;
  sourceAntenna: string;
  sourceCountryCode: string;
  destinationAntennaId: string;
  destinationAntenna: string;
  destinationCountryCode: string;
  grossAmountMinor: number;
  netAmountMinor: number;
  commissionAmountMinor: number;
  commissionRateBps: number;
  currency: StssCurrency;
  status: StssStatus;
  isSimulation: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export type StssTransferView = Omit<StssTransfer, "idempotencyKey">;

export interface StssCurrencyAggregate {
  grossAmountMinor: number;
  netAmountMinor: number;
  commissionAmountMinor: number;
}

export interface StssAggregate {
  total: number;
  simulation: number;
  byStatus: Record<StssStatus, number>;
  byCurrency: Record<StssCurrency, StssCurrencyAggregate>;
  currencies: StssCurrency[];
}

export const STSS_STATUS_LABELS: Record<StssStatus, string> = {
  DRAFT: "Brouillon",
  PENDING_KYC: "KYC en attente",
  PENDING_PAYMENT: "Paiement en attente",
  PAYMENT_CONFIRMED: "Paiement confirmé",
  TRANSFER_PENDING: "Transfert en attente",
  TRANSFER_CONFIRMED: "Transfert confirmé",
  FAILED: "Échec",
  CANCELLED: "Annulé",
  SIMULATION: "Simulation"
};

export function emptyStssAggregate(): StssAggregate {
  return {
    total: 0,
    simulation: 0,
    byStatus: {
      DRAFT: 0,
      PENDING_KYC: 0,
      PENDING_PAYMENT: 0,
      PAYMENT_CONFIRMED: 0,
      TRANSFER_PENDING: 0,
      TRANSFER_CONFIRMED: 0,
      FAILED: 0,
      CANCELLED: 0,
      SIMULATION: 0
    },
    byCurrency: {
      FCFA: { grossAmountMinor: 0, netAmountMinor: 0, commissionAmountMinor: 0 },
      XAF: { grossAmountMinor: 0, netAmountMinor: 0, commissionAmountMinor: 0 },
      USD: { grossAmountMinor: 0, netAmountMinor: 0, commissionAmountMinor: 0 },
      EUR: { grossAmountMinor: 0, netAmountMinor: 0, commissionAmountMinor: 0 },
      CAD: { grossAmountMinor: 0, netAmountMinor: 0, commissionAmountMinor: 0 }
    },
    currencies: []
  };
}
