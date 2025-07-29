export enum Currency {
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
  BDT = "BDT",
  INR = "INR",
}

export const CurrencySymbols: Record<Currency, string> = {
  [Currency.USD]: "$",
  [Currency.EUR]: "€",
  [Currency.GBP]: "£",
  [Currency.BDT]: "৳",
  [Currency.INR]: "₹",
};

export const CurrencyLabels: Record<Currency, string> = {
  [Currency.USD]: "US Dollar",
  [Currency.EUR]: "Euro",
  [Currency.GBP]: "British Pound",
  [Currency.BDT]: "Bangladeshi Taka",
  [Currency.INR]: "Indian Rupee",
};
