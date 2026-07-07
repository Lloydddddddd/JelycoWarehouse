import api from "../../../Core/Services/axiosConfig";

export async function getItems() {
  return api.get("/items");
}

export async function getItem(id) {
  return api.get(`/items/${id}`);
}

export async function createItem(item) {
  return api.post("/items", item);
}

export async function updateItem(id, item) {
  return api.put(`/items/${id}`, item);
}

export async function deleteItem(id) {
  return api.delete(`/items/${id}`);
}