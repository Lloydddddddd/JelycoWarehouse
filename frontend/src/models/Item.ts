export interface Item {
  id: number;
  name: string;
  brand: string;
  kind: string;
  size: string;
  category: string;
  quantity: number;
  unitPrice: number;
  reorderLevel: number;
  expiryDate: string | null;
  supplierId: number;
  supplierName: string;
  isActive: boolean;
}