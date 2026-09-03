import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "FCFA"): string {
  return new Intl.NumberFormat("fr-FR").format(amount) + " " + currency;
}
