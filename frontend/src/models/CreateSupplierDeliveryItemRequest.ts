export interface CreateSupplierDeliveryItemRequest {
  itemId: number;
  quantity: number;
  unitCost: number;
  totalCost: number;

  expiryDate: string | null;
}