import { API } from "../config/api";
import { apiClient } from "../lib/apiClient";

import type { Transaction } from "../models/Transaction";
import type { CreateTransactionRequest } from "../models/CreateTransactionRequest";

export async function getTransactions(): Promise<Transaction[]> {
  const response = await apiClient(API.transactions.all);

  return response.json();
}

export async function createTransaction(
  transaction: CreateTransactionRequest
): Promise<Transaction> {
  const response = await apiClient(API.transactions.all, {
    method: "POST",
    body: JSON.stringify(transaction),
  });

  return response.json();
}

export async function updateTransaction(
  id: number,
  transaction: CreateTransactionRequest
): Promise<void> {
  await apiClient(`${API.transactions.all}/${id}`, {
    method: "PUT",
    body: JSON.stringify(transaction),
  });
}

export async function deleteTransaction(
  id: number
): Promise<void> {
  await apiClient(`${API.transactions.all}/${id}`, {
    method: "DELETE",
  });
}