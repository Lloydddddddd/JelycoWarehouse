const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API = {
  auth: {
    login: `${BASE_URL}/auth/login`,
    register: `${BASE_URL}/auth/register`,
    refresh: `${BASE_URL}/auth/refresh`,
    logout: `${BASE_URL}/auth/logout`,
  },

  items: {
    all: `${BASE_URL}/items`,
    count: `${BASE_URL}/items/count`,
    byId: (id: number) => `${BASE_URL}/items/${id}`,
  },

  suppliers: {
    all: `${BASE_URL}/suppliers`,
    count: `${BASE_URL}/suppliers/count`,
    byId: (id: number) => `${BASE_URL}/suppliers/${id}`,
  },

  locations: {
    all: `${BASE_URL}/locations`,
    byId: (id: number) => `${BASE_URL}/locations/${id}`,
  },

  transactions: {
    all: `${BASE_URL}/transactions`,
    dashboard: `${BASE_URL}/transactions/dashboard`,
    filter: `${BASE_URL}/transactions/filter`,
  },

  supplierDeliveries: {
    all: `${BASE_URL}/supplierdeliveries`,
    byId: (id: number) =>
      `${BASE_URL}/supplierdeliveries/${id}`,
  },

  warehouseReleases: {
    all: `${BASE_URL}/warehousereleases`,
    byId: (id: number) =>
      `${BASE_URL}/warehousereleases/${id}`,
  },

  inventoryAdjustments: {
    all: `${BASE_URL}/inventoryadjustments`,
    byId: (id: number) =>
      `${BASE_URL}/inventoryadjustments/${id}`,
  },
};