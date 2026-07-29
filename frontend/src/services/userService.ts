import { API } from "../config/api";
import { apiClient } from "../lib/apiClient";

import type { User } from "../models/user";

export async function getCurrentUser(): Promise<User> {
  const response = await apiClient(API.users.me);

  return response.json();
}