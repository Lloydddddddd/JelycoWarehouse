import { API } from "../config/api";
import { apiClient } from "../lib/apiClient";

import type { Item } from "../models/Item";
import type { CreateItemRequest } from "../models/CreateItemRequest";

export async function getItems(): Promise<Item[]> {
  const response = await apiClient(API.items.all);

  return response.json();
}

export async function createItem(item: CreateItemRequest) {
  const response = await apiClient(API.items.all, {
    method: "POST",
    body: JSON.stringify(item),
  });

  return response.json();
}

export async function updateItem(
  id: number,
  item: CreateItemRequest
) {
  await apiClient(API.items.byId(id), {
    method: "PUT",
    body: JSON.stringify(item),
  });
}

export async function deleteItem(id: number) {
  await apiClient(API.items.byId(id), {
    method: "DELETE",
  });
}