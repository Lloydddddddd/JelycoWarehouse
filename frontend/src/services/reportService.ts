import { API } from "../config/api";
import { apiClient } from "../lib/apiClient";

import type { InventoryReport } from "../models/InventoryReport";
import type { TransactionReport } from "../models/TransactionReport";
import type { LowStockReport } from "../models/LowStockReport";
import type { ExpiringItemsReport } from "../models/ExpiringItemsReport";
import type { SupplierDeliveryReport } from "../models/SupplierDeliveryReport";
import type { WarehouseReleaseReport } from "../models/WarehouseReleaseReport";

export async function getInventoryReport(): Promise<InventoryReport[]> {
  const response = await apiClient(API.reports.inventory);
  return response.json();
}

export async function getTransactionReport(): Promise<TransactionReport[]> {
  const response = await apiClient(API.reports.transactions);
  return response.json();
}

export async function getLowStockReport(): Promise<LowStockReport[]> {
  const response = await apiClient(API.reports.lowStock);
  return response.json();
}

export async function getExpiringItemsReport(): Promise<ExpiringItemsReport[]> {
  const response = await apiClient(API.reports.expiringItems);
  return response.json();
}

export async function getSupplierDeliveryReport(): Promise<SupplierDeliveryReport[]> {
  const response = await apiClient(API.reports.supplierDeliveries);
  return response.json();
}

export async function getWarehouseReleaseReport(): Promise<WarehouseReleaseReport[]> {
  const response = await apiClient(API.reports.warehouseReleases);
  return response.json();
}