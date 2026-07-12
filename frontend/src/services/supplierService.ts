import { API } from "../config/api";
import { apiClient } from "../lib/apiClient";

import type { Supplier } from "../models/Supplier";
import type { CreateSupplierRequest } from "../models/CreateSupplierRequest";

export async function getSuppliers(): Promise<Supplier[]> {
  const response = await apiClient(API.suppliers.all);

  return response.json();
}

export async function createSupplier(
  supplier: CreateSupplierRequest
) {
  const response = await apiClient(API.suppliers.all, {
    method: "POST",
    body: JSON.stringify(supplier),
  });

  return response.json();
}

export async function updateSupplier(
  id: number,
  supplier: CreateSupplierRequest
) {
  await apiClient(API.suppliers.byId(id), {
    method: "PUT",
    body: JSON.stringify(supplier),
  });
}

export async function deleteSupplier(id: number) {
  await apiClient(API.suppliers.byId(id), {
    method: "DELETE",
  });
}