import { API } from "../config/api";
import { apiClient } from "../lib/apiClient";
import type { Brand } from "../models/Brand";
import type { CreateBrandRequest } from "../models/CreateBrandRequest";

export async function getBrands(): Promise<Brand[]> {
  const response = await apiClient(API.brands.all);

  if (!response.ok) {
    throw new Error("Failed to load brands.");
  }

  return response.json();
}

export async function getBrand(
  id: number
): Promise<Brand> {
  const response = await apiClient(
    API.brands.byId(id)
  );

  if (!response.ok) {
    throw new Error("Failed to load brand.");
  }

  return response.json();
}

export async function createBrand(
  request: CreateBrandRequest
): Promise<Brand> {
  const response = await apiClient(
    API.brands.all,
    {
      method: "POST",
      body: JSON.stringify(request),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create brand.");
  }

  return response.json();
}

export async function updateBrand(
  id: number,
  request: CreateBrandRequest
): Promise<void> {
  const response = await apiClient(
    API.brands.byId(id),
    {
      method: "PUT",
      body: JSON.stringify(request),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update brand.");
  }
}

export async function deleteBrand(
  id: number
): Promise<void> {
  const response = await apiClient(
    API.brands.byId(id),
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete brand.");
  }
}