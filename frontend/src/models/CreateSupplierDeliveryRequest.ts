import type { CreateSupplierDeliveryItemRequest } from "./CreateSupplierDeliveryItemRequest";

export interface CreateSupplierDeliveryRequest {
  supplierId: number;

  deliveryReference: string;

  deliveryDate: string;

  grandTotal: number;

  items: CreateSupplierDeliveryItemRequest[];
}