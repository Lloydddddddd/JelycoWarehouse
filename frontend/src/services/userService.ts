import { API } from "../config/api";
import { apiClient } from "../lib/apiClient";

import type { User } from "../models/user";

export async function getCurrentUser(): Promise<User> {
    const response = await apiClient(API.users.me);

    return response.json();
}

export interface UpdateProfileRequest {
    fullName: string;
}

export async function updateProfile(
    request: UpdateProfileRequest
): Promise<User> {
    const response = await apiClient(API.users.me, {
        method: "PUT",
        body: JSON.stringify(request),
    });

    return response.json();
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export async function changePassword(
    request: ChangePasswordRequest
): Promise<void> {
    const response = await apiClient(API.users.password, {
        method: "PUT",
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const error = await response.json();

        throw new Error(
            error.message ?? "Unable to change password."
        );
    }
}