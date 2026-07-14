import type { CreateWarehouseReleaseItemRequest } from "./CreateWarehouseReleaseItemRequest";

export interface CreateWarehouseReleaseRequest {
  releaseDate: string;

  destination: string;

  items: CreateWarehouseReleaseItemRequest[];
}