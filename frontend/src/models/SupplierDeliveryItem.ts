export interface SupplierDeliveryItem {
  itemId: number;
  itemName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  expiryDate: string | null;
}