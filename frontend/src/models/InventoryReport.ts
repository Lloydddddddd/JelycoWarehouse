export interface InventoryReport {
  itemId: number;
  itemName: string;
  brand: string;
  category: string;
  kind: string;
  size: string;
  color: string;
  currentStock: number;
  reorderLevel: number;
  unitCost: number;
  stockValue: number;
  status: string;
  expiryDate: string | null;
}