import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format number as Indian Rupee with Indian digit grouping
export function formatINR(amount: number) {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(isNaN(amount) ? 0 : amount);
  } catch {
    // Fallback formatting
    const rounded = Math.round(isNaN(amount) ? 0 : amount).toString();
    return `₹${rounded.replace(/\B(?=(\d{2})+(?!\d))/g, ',')}`;
  }
}
