export interface LowStockReport {
  itemId: number;
  itemName: string;
  brand: string;
  category: string;
  currentStock: number;
  reorderLevel: number;
  status: string;
}