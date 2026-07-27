export interface ExpiringItemsReport {
  itemId: number;
  itemName: string;
  brand: string;
  category: string;
  expiryDate: string;
  daysRemaining: number;
  status: string;
}