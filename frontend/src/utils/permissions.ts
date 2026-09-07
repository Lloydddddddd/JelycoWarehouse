import type { User } from "../models/user";


export function canManageUsers(user: User | null) {
    return user?.role === "Admin";
}


export function canManageInventory(user: User | null) {
    return (
        user?.role === "Admin" ||
        user?.role === "Manager"
    );
}


export function canOperateWarehouse(user: User | null) {
    return (
        user?.role === "Admin" ||
        user?.role === "Manager" ||
        user?.role === "Staff"
    );
}


export function canViewReports(user: User | null) {
    return (
        user?.role === "Admin" ||
        user?.role === "Manager" ||
        user?.role === "Staff" ||
        user?.role === "Viewer"
    );
}