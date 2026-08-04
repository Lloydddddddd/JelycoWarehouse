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
        let message = `HTTP ${response.status}`;

        try {
            const error = await response.json();

            if (error.message) {
                message = error.message;
            }
        } catch {
            // Ignore if response body is not JSON
        }

        throw new Error(message);
    }

    return response;
}