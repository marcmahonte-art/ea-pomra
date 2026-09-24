export type CountryCode = "SN" | "CI" | "CM" | "GA" | "BJ" | "TG" | "CG" | "CD";

export interface Antenne {
  id: string;
  code: CountryCode;
  country: string;
  city: string;
  flag: string;
  coordinator: string;
  phone: string;
  email: string;
  address: string;
  partnersCount: number;
  studentsCount: number;
}

export type DossierStatus = 
  | "DRAFT" 
  | "OCO_REVIEW" 
  | "OCO_APPROVED" 
  | "STSS_PENDING"
  | "STSS_SIMULATION"
  | "ARRIVED_PAP_ACTIVE" 
  | "GRADUATED";

export interface StudentProfile {
  id: string;
  idPombra: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsapp: string;
  originCountry: string;
  originFlag: string;
  targetCountry: string;
  targetFlag: string;
  targetUniversity: string;
  program: string;
  degreeLevel: string;
  academicYear: string;
  status: DossierStatus;
  statusLabel: string;
  currentStepIndex: number; // 0 to 3
  ocoFeedback?: {
    date: string;
    verdict: "Favorable" | "Sous réserve" | "Défavorable";
    expertName: string;
    comment: string;
  };
  stssTransaction?: {
    id: string;
    amount: number;
    currency: string;
    status: "SIMULATION";
    simulationDate: string;
    representedUniversity: string;
     referenceCode: string;
  };
  parentContact: {
    name: string;
    relation: string;
    phone: string;
    email: string;
    hasPortalAccess: boolean;
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: "info" | "success" | "warning" | "action_required";
  link?: string;
}

export interface TimelineEvent {
  title: string;
  date: string;
  description: string;
  status: "completed" | "current" | "upcoming";
  actor: string;
  badgeText?: string;
}
