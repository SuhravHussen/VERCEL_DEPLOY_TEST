import { Currency, CurrencySymbols } from "@/types/currency";

/**
 * Format a date string to a readable format
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

/**
 * Format a time string to a readable format
 */
export function formatTime(timeString: string): string {
  try {
    // Handle both "HH:MM" and "HH:MM:SS" formats
    const timeParts = timeString.split(":");
    if (timeParts.length >= 2) {
      const hours = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1], 10);

      if (isNaN(hours) || isNaN(minutes)) {
        return timeString;
      }

      const date = new Date();
      date.setHours(hours, minutes, 0, 0);

      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }

    return timeString;
  } catch {
    return timeString;
  }
}

/**
 * Format currency with proper symbol and formatting
 */
export function formatCurrency(amount: number, currency: Currency): string {
  const symbol = CurrencySymbols[currency] || currency;

  // Format with commas for thousands
  const formattedAmount = amount.toLocaleString("en-US", {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });

  return `${symbol}${formattedAmount}`;
}

/**
 * Get relative time from now
 */
export function getRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = date.getTime() - now.getTime();
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays < 0) {
      return "Past";
    } else if (diffInDays === 0) {
      return "Today";
    } else if (diffInDays === 1) {
      return "Tomorrow";
    } else if (diffInDays <= 7) {
      return `In ${diffInDays} days`;
    } else {
      return formatDate(dateString);
    }
  } catch {
    return dateString;
  }
}
