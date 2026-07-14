import { API } from "../config/api";
import { apiClient } from "../lib/apiClient";

import type { InventoryAdjustment } from "../models/InventoryAdjustment";
import type { CreateInventoryAdjustmentRequest } from "../models/CreateInventoryAdjustmentRequest";

export async function getInventoryAdjustments(): Promise<InventoryAdjustment[]> {
  const response = await apiClient(
    API.inventoryAdjustments.all
  );

  return await response.json();
}

export async function getInventoryAdjustment(
  id: number
): Promise<InventoryAdjustment> {
  const response = await apiClient(
    API.inventoryAdjustments.byId(id)
  );

  return await response.json();
}

export async function createInventoryAdjustment(
  adjustment: CreateInventoryAdjustmentRequest
): Promise<InventoryAdjustment> {
  const response = await apiClient(
    API.inventoryAdjustments.all,
    {
      method: "POST",
      body: JSON.stringify(adjustment),
    }
  );

  return await response.json();
}

export async function deleteInventoryAdjustment(
  id: number
): Promise<void> {
  await apiClient(
    API.inventoryAdjustments.byId(id),
    {
      method: "DELETE",
    }
  );
}