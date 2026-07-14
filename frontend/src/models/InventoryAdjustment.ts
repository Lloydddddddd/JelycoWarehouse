import type { InventoryAdjustmentItem } from "./InventoryAdjustmentItem";

export interface InventoryAdjustment {
  id: number;

  adjustmentReference: string;
  adjustmentDate: string;

  reason: string;

  items: InventoryAdjustmentItem[];
}