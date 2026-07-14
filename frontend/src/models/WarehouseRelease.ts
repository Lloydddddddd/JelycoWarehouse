import type { WarehouseReleaseItem } from "./WarehouseReleaseItem";

export interface WarehouseRelease {
  id: number;
  releaseReference: string;
  releaseDate: string;
  destination: string;
  grandTotal: number;

  items: WarehouseReleaseItem[];
}