import { API } from "../config/api";
import { apiClient } from "../lib/apiClient";

import type { SupplierDelivery } from "../models/SupplierDelivery";
import type { CreateSupplierDeliveryRequest } from "../models/CreateSupplierDeliveryRequest";

export async function getSupplierDeliveries(): Promise<SupplierDelivery[]> {
  const response = await apiClient(
    API.supplierDeliveries.all
  );

  return response.json();
}

export async function createSupplierDelivery(
  delivery: CreateSupplierDeliveryRequest
) {
  const response = await apiClient(
    API.supplierDeliveries.all,
    {
      method: "POST",
      body: JSON.stringify(delivery),
    }
  );

  return response.json();
}

export async function deleteSupplierDelivery(
  id: number
) {
  await apiClient(
    API.supplierDeliveries.byId(id),
    {
      method: "DELETE",
    }
  );
}