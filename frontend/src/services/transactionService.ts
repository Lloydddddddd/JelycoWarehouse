import { API } from "../config/api";
import { apiClient } from "../lib/apiClient";

import type { Transaction } from "../models/Transaction";

export async function getTransactions(): Promise<Transaction[]> {
  const response = await apiClient(API.transactions.all);

  return response.json();
}