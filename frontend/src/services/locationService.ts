import { API } from "../config/api";
import { apiClient } from "../lib/apiClient";

import type { Location } from "../models/Location";

export async function getLocations(): Promise<Location[]> {
  const response = await apiClient(API.locations.all);

  return response.json();
}