export interface CreateItemRequest {
  name: string;
  brand: string;
  kind: string;
  size: string;
  color: string;
  category: string;
  quantity: number;
  costPrice: number;
  reorderLevel: number;
  expiryDate: string | null;
  supplierId: number;
}