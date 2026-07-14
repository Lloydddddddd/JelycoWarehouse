import type { CreateInventoryAdjustmentItemRequest } from "./CreateInventoryAdjustmentItemRequest";

export interface CreateInventoryAdjustmentRequest {
  adjustmentDate: string;

  reason: string;

  items: CreateInventoryAdjustmentItemRequest[];
}