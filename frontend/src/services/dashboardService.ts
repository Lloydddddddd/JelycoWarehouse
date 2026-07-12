import { API } from "../config/api";
import { apiClient } from "../lib/apiClient";
import type { Dashboard } from "../models/Dashboard";

export async function getDashboard(): Promise<Dashboard> {
  const response = await apiClient(API.transactions.dashboard);

  return response.json();
}