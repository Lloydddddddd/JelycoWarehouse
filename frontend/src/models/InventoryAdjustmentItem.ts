export interface InventoryAdjustmentItem {
  itemId: number;
  itemName: string;

  systemQuantity: number;
  actualQuantity: number;
  difference: number;
}