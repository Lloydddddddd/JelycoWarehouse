import type { SupplierDeliveryItem } from "./SupplierDeliveryItem";

export interface SupplierDelivery {
  id: number;

  supplierId: number;

  supplierName: string;

  deliveryReference: string;

  deliveryDate: string;

  grandTotal: number;

  items: SupplierDeliveryItem[];
}