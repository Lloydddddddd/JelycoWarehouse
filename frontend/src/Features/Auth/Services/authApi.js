import api from "../../../Core/Services/axiosConfig";

// Login user
export async function login(email, password) {
  try {
    const res = await api.post("/auth/login", { email, password });
    return res;
  } catch (error) {
    throw error.response?.data || error;
  }
}

// Register user
export async function register(fullName, email, password) {
  try {
    const res = await api.post("/auth/register", { fullName, email, password });
    return res;
  } catch (error) {
    throw error.response?.data || error;
  }
}

// Refresh token
export async function refresh(refreshToken) {
  try {
    const res = await api.post("/auth/refresh", { refreshToken });
    return res;
  } catch (error) {
    throw error.response?.data || error;
  }
}

// Logout user
export async function logout() {
  try {
    const res = await api.post("/auth/logout");
    return res;
  } catch (error) {
    throw error.response?.data || error;
  }
}

// Extract user roles from JWT
export function getUserRoles() {
  const token = localStorage.getItem("token");
  if (!token) return [];

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const roles =
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    // Normalize: return array even if single role
    if (!roles) return [];
    return Array.isArray(roles) ? roles : [roles];
  } catch {
    return [];
  }
}