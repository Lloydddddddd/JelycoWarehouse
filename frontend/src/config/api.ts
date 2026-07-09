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
  },

  suppliers: {
    all: `${BASE_URL}/suppliers`,
    count: `${BASE_URL}/suppliers/count`,
  },

  transactions: {
    all: `${BASE_URL}/transactions`,
    dashboard: `${BASE_URL}/transactions/dashboard`,
    filter: `${BASE_URL}/transactions/filter`,
  },

  supplierDeliveries: {
    all: `${BASE_URL}/SupplierDeliveries`,
  },
};