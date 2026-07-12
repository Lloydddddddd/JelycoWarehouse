export async function apiClient(
  url: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem("token");

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",

      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),

      ...options.headers,
    },
  });

  // Token expired or invalid
  if (response.status === 401) {
    localStorage.removeItem("token");

    window.location.href = "/login";

    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response;
}