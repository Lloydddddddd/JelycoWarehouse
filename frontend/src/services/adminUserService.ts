import { API } from "../config/api";
import { apiClient } from "../lib/apiClient";

import type { User } from "../models/user";
import type { CreateUserRequest } from "../models/CreateUserRequest";
import type { UpdateUserRequest } from "../models/UpdateUserRequest";
import type { UpdateUserStatusRequest } from "../models/UpdateUserStatusRequest";
import type { OperationResult } from "../models/OperationResult";

export async function getUsers(): Promise<User[]> {
    const response = await apiClient(API.adminUsers.all);

    return response.json();
}

export async function createUser(
    request: CreateUserRequest
): Promise<OperationResult> {

    const response = await apiClient(API.adminUsers.all, {
        method: "POST",
        body: JSON.stringify(request),
    });

    return response.json();
}

export async function updateUser(
    id: string,
    request: UpdateUserRequest
): Promise<OperationResult> {

    const response = await apiClient(API.adminUsers.byId(id), {
        method: "PUT",
        body: JSON.stringify(request),
    });

    return response.json();
}

export async function updateUserStatus(
    id: string,
    request: UpdateUserStatusRequest
): Promise<OperationResult> {

    const response = await apiClient(API.adminUsers.status(id), {
        method: "PATCH",
        body: JSON.stringify(request),
    });

    return response.json();
}