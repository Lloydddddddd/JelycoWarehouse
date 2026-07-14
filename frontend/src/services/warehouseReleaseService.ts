import { API } from "../config/api";
import { apiClient } from "../lib/apiClient";

import type { WarehouseRelease } from "../models/WarehouseRelease";
import type { CreateWarehouseReleaseRequest } from "../models/CreateWarehouseReleaseRequest";

export async function getWarehouseReleases(): Promise<WarehouseRelease[]> {
  const response = await apiClient(
    API.warehouseReleases.all
  );

  return response.json();
}

export async function getWarehouseRelease(
  id: number
): Promise<WarehouseRelease> {
  const response = await apiClient(
    API.warehouseReleases.byId(id)
  );

  return response.json();
}

export async function createWarehouseRelease(
  release: CreateWarehouseReleaseRequest
) {
  const response = await apiClient(
    API.warehouseReleases.all,
    {
      method: "POST",
      body: JSON.stringify(release),
    }
  );

  return response.json();
}

export async function deleteWarehouseRelease(
  id: number
) {
  await apiClient(
    API.warehouseReleases.byId(id),
    {
      method: "DELETE",
    }
  );
}