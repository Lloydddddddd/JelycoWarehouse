import api from "../../../Core/Services/axiosConfig";

export async function getSuppliers() {
  return api.get("/suppliers");
}

export async function getSupplier(id) {
  return api.get(`/suppliers/${id}`);
}

export async function createSupplier(supplier) {
  return api.post("/suppliers", supplier);
}

export async function updateSupplier(id, supplier) {
  return api.put(`/suppliers/${id}`, supplier);
}

export async function deleteSupplier(id) {
  return api.delete(`/suppliers/${id}`);
}