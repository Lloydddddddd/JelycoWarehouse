export interface WarehouseReleaseReport {
  releaseId: number;
  releaseReference: string;
  releaseDate: string;
  destination: string;
  totalQuantity: number;
  grandTotal: number;
}