
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  // Format the amount based on the currency
  switch (currency) {
    case 'USD':
      return `$${amount.toFixed(2)}`;
    case 'EUR':
      return `€${amount.toFixed(2)}`;
    case 'GBP':
      return `£${amount.toFixed(2)}`;
    case 'JPY':
      return `¥${Math.round(amount)}`;
    case 'CAD':
      return `C$${amount.toFixed(2)}`;
    case 'IDR':
      return `Rp${amount.toFixed(2)}`;
    default:
      return `${currency} ${amount.toFixed(2)}`;
  }
}
