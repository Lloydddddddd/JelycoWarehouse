import { API } from "../config/api";
import type { Item } from "../models/Item";

export async function getItems(): Promise<Item[]> {
  const token = localStorage.getItem("token");

  const response = await fetch(API.items.all, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch items.");
  }

  return response.json();
}